// Import Dependencies
import { Page } from "components/shared/Page";
import { InnerItem } from "./InnerItem";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { useState, useEffect } from "react";

// Local Imports
import { Button } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { useFeachData } from "hooks/useApiHook";

// ----------------------------------------------------------------------

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

const doctype = "Platform"
const fields = ['name', 'type']

const doctype1 = "Platform Integration"
const fields1 = ['name', 'platform', 'email']

export default function ListData() {
  const { user } = useAuthContext();
  const [lists, setLists] = useState({});

  const { data } = useFeachData({ doctype, page: 1, page_length: 100, fields: JSON.stringify(fields) });
  const { data: dataValue } = useFeachData({ doctype: doctype1, page: 1, page_length: 100, filters: JSON.stringify([[doctype1, "client", "=", user?.clientId]]), fields: JSON.stringify(fields1) });

  useEffect(() => {
    if (data?.data) {
      const grouped = groupBy(data?.data, 'type');
      setLists(grouped)
    }
  }, [data])

  return (
    <Page title="Integration">
      <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] px-(--margin-x) py-4">
        <div className="flex items-center justify-between space-x-4 ">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              {doctype}s
            </h2>
          </div>
        </div>
        <div
          className={clsx(
            "flex flex-col pt-4"
          )}
        >
          <TabGroup defaultIndex={0}>
            <div className="hide-scrollbar overflow-x-auto">
              <TabList className="flex w-max min-w-full rounded-lg bg-gray-200 px-1.5 py-1 text-gray-600 dark:bg-dark-900 dark:text-dark-200">
                {Object.keys(lists).map((name, key) => {
                  return <Tab
                    key={key}
                    className={({ selected }) =>
                      clsx(
                        "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium",
                        selected
                          ? "bg-white shadow dark:bg-surface-2 dark:text-dark-100"
                          : "hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
                      )
                    }
                    as={Button}
                    unstyled
                  >
                    {name}
                  </Tab>
                })}
              </TabList>
            </div>
            <TabPanels className="mt-3">
              {Object.keys(lists).map((name, key) => {
                return <TabPanel key={key}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-5 lg:gap-6 mx-auto">
                    {lists[name].map((item) => (
                      <InnerItem
                        key={item.id}
                        title={item.name}
                        data={dataValue?.data}
                      />
                    ))}
                  </div>
                </TabPanel>
              })}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </Page>
  );
}
