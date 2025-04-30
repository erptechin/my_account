// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { productInfoSchema } from "../schema";
import { useInfo } from "hooks/useApiHook";

// ----------------------------------------------------------------------

const doctype = "My Brand"
const fields = ['logos', 'colors', 'products']
const tableFields = {
    "logos": { "image": "image" },
    "colors": { "color": "color" },
    "products": {  "product": ['product_name', 'product_description'] },
}

export function ProductInfo({ setCurrentStep, data, setData }) {
    const { data: info } = useInfo({ doctype, fields: JSON.stringify([...fields]) });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: yupResolver(productInfoSchema),
        defaultValues: data,
    });

    const onSubmit = (data) => {
        setData({ ...data, isDone: true })
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
                <Button className="min-w-[7rem]" onClick={() => setCurrentStep(0)}>Back</Button>
                <Button type="submit" className="min-w-[7rem]" color="primary">
                    Save
                </Button>
            </div>
        </form>
    );
}

ProductInfo.propTypes = {
    setCurrentStep: PropTypes.func,
    data: PropTypes.any,
    setData: PropTypes.func,
};
