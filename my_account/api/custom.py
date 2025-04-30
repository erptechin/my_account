import frappe

@frappe.whitelist()
def update_sms(doc, method):
    duplicate = frappe.db.exists("SMS List", {"user_id": doc.user_id, "message_id": doc.message_id})
    if duplicate:
        frappe.throw(f"Duplicate SMS found: {duplicate}")
    else:
        pass