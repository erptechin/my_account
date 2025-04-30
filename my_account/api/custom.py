import frappe
import re

@frappe.whitelist()
def update_sms(doc, method):
    isNew = doc.get("__islocal", False)
    if isNew:
        duplicate = frappe.db.exists("SMS List", {"user_id": doc.user_id, "message_id": doc.message_id})
        if duplicate:
            frappe.throw(f"Duplicate SMS found: {duplicate}")
        else:
            details = extract_transaction_details(doc.body)
            if details:
                if details['transaction_type'] == "debit":
                    details['debit'] = details['amount']
                else:
                    details['credit'] = details['amount']

                doc.update(details)

@frappe.whitelist(allow_guest=True)
def calculate_details():
    sms_list = frappe.get_all(
        "SMS List",
        fields=["name", "body"],
        filters={}
    )
    for sms in sms_list:
        details = extract_transaction_details(sms['body'])
        if details:
            if details['transaction_type'] == "debit":
                details['debit'] = details['amount']
            else:
                details['credit'] = details['amount']
            
            sms_doc = frappe.get_doc("SMS List", sms['name'])
            sms_doc.update(details)
            sms_doc.save()

    return "Calculate Successfully"

def extract_transaction_details(message):
    result = {
        "transaction_type": None,
        "amount": None,
        "currency": None,
        "card_type": None,
        "card_last4": None,
        "merchant": None
    }

    # Detect credit or debit
    if re.search(r"\b(spent|debited|purchase|withdrawn|txn.*done|transaction.*made)\b", message, re.IGNORECASE):
        result["transaction_type"] = "debit"
    elif re.search(r"\b(credited|received|deposit)\b", message, re.IGNORECASE):
        result["transaction_type"] = "credit"

    # Extract amount and currency
    amount_match = re.search(r"(Rs\.?|INR|USD|\$|€|₹)\s*([\d,]+\.\d{2})", message, re.IGNORECASE)
    if amount_match:
        result["currency"] = amount_match.group(1)
        result["amount"] = float(amount_match.group(2).replace(",", ""))

    # Extract card type and last 4 digits
    card_match = re.search(r"([A-Za-z\s]+Card).*?ending\s*(\d{4})", message, re.IGNORECASE)
    if card_match:
        result["card_type"] = card_match.group(1).strip()
        result["card_last4"] = card_match.group(2)

    # Extract merchant
    merchant_match = re.search(r"at\s+([A-Za-z0-9\s&\-_.]+?)\s+(on|at|\d{2}[\/\-]\d{2}[\/\-]\d{2,4})", message, re.IGNORECASE)
    if merchant_match:
        result["merchant"] = merchant_match.group(1).strip()

    return result