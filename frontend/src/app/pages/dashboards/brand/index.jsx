// Import Dependencies
import { useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import clsx from "clsx";
import { Spinner } from "components/ui";

// Local Imports
import { Page } from "components/shared/Page";
import { Card } from "components/ui";
import { Stepper } from "./Stepper";
import { BrandInfo } from "./steps/BrandInfo";
import { ProductInfo } from "./steps/ProductInfo";
import { useFeachData } from "./hook";
import { useAddData, useUpdateData } from "hooks/useApiHook";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

const doctype = "My Brand"
const step1 = ['brand_name', 'category', 'about_your_brand', 'target_group']
const step2 = ['logos', 'colors', 'products']

const steps = [
  {
    key: "brandInfo",
    component: BrandInfo,
    label: "General Info",
    description: "Let's onboard your brand",
  },
  {
    key: "productInfo",
    component: ProductInfo,
    label: "Product Info",
    description: "Enter Colors, Logos and Products",
  }
];

const Brand = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { data: get_data } = useFeachData({ doctype, fields: JSON.stringify([...step1, ...step2]) });
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (get_data) {
      setData(get_data)
    }
  }, [get_data])

  const mutationAdd = useAddData((data) => { queryClient.invalidateQueries({ queryKey: ['profile'] }) });
  const mutationUpdate = useUpdateData((data) => { });

  useEffect(() => {
    if (data && data.isDone) {
      if (data?.name) {
        mutationUpdate.mutate({ doctype, body: { ...data, id: data?.name } })
      } else {
        mutationAdd.mutate({ doctype, body: { ...data, client: user.clientId } })
      }
    }
  }, [data])

  const ActiveForm = steps[currentStep].component;

  const stepsNode = (
    <>
      <div className="col-span-12 sm:order-last sm:col-span-4 lg:col-span-3">
        <div className="sticky top-24 sm:mt-3">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>
      <div className="col-span-12 sm:col-span-8 lg:col-span-9">
        <Card className="h-full p-4 sm:p-5">
          <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            {steps[currentStep].label}
          </h5>
          <p className="text-sm text-gray-500 dark:text-dark-200">
            {steps[currentStep].description}
          </p>
          {!finished && (
            <ActiveForm
              setCurrentStep={setCurrentStep}
              data={data}
              setData={setData}
              setFinished={setFinished}
            />
          )}
        </Card>
      </div>
    </>
  );

  return (
    <Page title="Brand">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-(--margin-x) pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          Brand
        </h2>
        <div
          className={clsx(
            "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6",
            !data && "grid-rows-[auto_1fr] sm:grid-rows-none "
          )}
        >
          {!data ? (
            <div className="col-span-12 place-self-center">
              <Spinner color="primary" className="size-16 border-4" />
            </div>
          ) : (
            stepsNode
          )}
        </div>
      </div>
    </Page>
  );
};

export default Brand;
