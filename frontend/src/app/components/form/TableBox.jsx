// Import Dependencies
import {
  Transition,
  TransitionChild,
  DialogPanel,
  Dialog
} from "@headlessui/react";
import { useDisclosure } from "hooks";
import { Button, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { forwardRef, Fragment, useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { JWT_HOST_API } from 'configs/auth.config';

// Local Imports
import { getListData } from 'utils/apis';
import SubValues from "./subValues";

// ----------------------------------------------------------------------

const TableBox = forwardRef(({ onChange, values, label, rootItem, tableFields, error }, ref) => {
  const [listData, setListData] = useState([]);
  const [newValues, setNewValues] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [state, setState] = useState({ status: "pending" });

  useEffect(() => {
    if (values) {
      setNewValues(values)
    }
  }, [values])

  useEffect(() => {
    if (rootItem?.sub_fields) {
      filterData()
    }
  }, [newValues])

  const filterData = async () => {
    let data = {}
    for (let item of rootItem.sub_fields) {
      if (item.fieldtype === "Link") {
        const doctype = item.options
        const fields = tableFields[item.fieldname] || []
        const filters = values ? values.map(value => value[item.fieldname]) : []
        let res = await getListData({
          doctype,
          filters: JSON.stringify([[doctype, "name", "in", filters]]),
          fields: JSON.stringify(["name", ...(Array.isArray(fields) ? fields : [])])
        })
        data[item.fieldname] = res.data
      }
    }
    setListData(data)
  }

  const [isOpen, { open, close }] = useDisclosure(false);

  const closePopup = (data) => {
    if (data) {
      setListData([])
      const seen = new Set();
      const uniqueLists = [];
      if (rootItem.sub_fields) {
        for (const item of [...newValues, data]) {
          const key = rootItem.sub_fields.map(k => item[k.fieldname]).join("|");
          if (!seen.has(key)) {
            seen.add(key);
            uniqueLists.push(item);
          }
        }
      } else {
        uniqueLists.push(data);
      }
      setNewValues(uniqueLists)
      onChange(uniqueLists)
    }
    close()
  }

  const handleDelete = () => {
    if (state) {
      const new_values = newValues
      if (state.key > -1) {
        new_values.splice(state.key, 1);
      }
      setNewValues(new_values)
      onChange(new_values)
      setState({ status: "success" })
    }
  }

  const confirmMessages = {
    pending: {
      description:
        `Are you sure you want to delete this, it cannot be restored.`,
    },
    success: {
      title: `Item Deleted`,
    },
  };

  // Add getDisplayValue helper function
  const getDisplayValue = (item, fieldName) => {
    return item[fieldName];
  };

  return (
    <>
      <div>
        <div className="flex items-center">
          <label className="input-label"><span className="input-label">{label}</span></label>
          <Button onClick={open} color="secondary" className="ml-auto">ADD NEW</Button>
        </div>

        <div className="relative mt-1.5">
          <div className="hide-scrollbar w-full max-w-[300px] sm:max-w-[400px] md:max-w-full overflow-x-auto overflow-y-hidden scroll-smooth">
            <Table hoverable className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  <Th className="w-16 bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">#</Th>
                  {rootItem?.sub_fields?.map((field, index) => {
                    if (field.fieldname in tableFields) {
                      return <Th
                        key={field.fieldname}
                        className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100"
                      >
                        {field.label || field.fieldname}
                      </Th>
                    }
                  })}
                  <Th className="w-16 bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">Action</Th>
                </Tr>
              </THead>
              <TBody>
                {newValues.map((item, index) => (
                  <Tr key={index} className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                    <Td>{index + 1}</Td>
                    {rootItem?.sub_fields?.map((field) => {
                      if (field.fieldname in tableFields) {
                        return <Td key={field.fieldname}>
                          {getDisplayValue(item, field.fieldname)}
                        </Td>
                      }
                    })}
                    <Td>
                      <Button
                        onClick={() => { setDeleteModalOpen(true); setState({ status: "pending", key: index }) }}
                        color="error"
                        isIcon
                        className="size-6 rounded-full"
                      >
                        <TiDelete className="size-5" />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
          <span className="input-text-error mt-1 text-xs text-error dark:text-error-lighter">{error}</span>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={close}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu transition-transform duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed right-0 top-0 flex h-full sm:w-[95%] md:w-[600px] transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-700">
              {isOpen && (<SubValues onClose={(data) => closePopup(data)} id={null} doctype={rootItem.options} />)}
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        messages={confirmMessages}
        onOk={handleDelete}
        confirmLoading={deleteLoading}
        state={state.status}
      />

    </>
  );
});

TableBox.displayName = "TableBox";

export { TableBox };
