// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { brandInfoSchema } from "../schema";
import { useInfo } from "hooks/useApiHook";

// ----------------------------------------------------------------------

const doctype = "My Brand"
const fields = ['brand_name', 'category', 'about_your_brand', 'target_group']
const tableFields = {
  "target_group": { "target_group": ["target_name", "gender", "age_group"] }
}

export function BrandInfo({ setCurrentStep, data, setData }) {
  const { data: info } = useInfo({ doctype, fields: JSON.stringify([...fields]) });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(brandInfoSchema),
    defaultValues: data,
  });

  const onSubmit = (data) => {
    setData({ ...data })
    setCurrentStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-4">
        <DynamicForms
          infos={info?.fields}
          fields={fields}
          register={register}
          control={control}
          errors={errors}
          tables={tableFields}
        />
      </div>
      <div className="mt-8 flex justify-end space-x-3 ">
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

BrandInfo.propTypes = {
  setCurrentStep: PropTypes.func,
  data: PropTypes.any,
  setData: PropTypes.func,
};
