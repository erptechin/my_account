import { useRef } from "react";
import { Controller } from 'react-hook-form';
import { SketchPicker } from 'react-color';
import Cleave from "cleave.js/react";
import TextareaAutosize from "react-textarea-autosize";
import { ContextualHelp } from "components/shared/ContextualHelp";
import { Input, Textarea, Checkbox, Button, Upload, Avatar } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TextEditor } from "components/shared/form/TextEditor";
import { htmlToDelta } from "utils/quillUtils";
import { JWT_HOST_API } from 'configs/auth.config';
import { SearchSelect } from "./SearchSelect";
import { TableBox } from "./TableBox";
import { useDropzone } from "react-dropzone";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useListState } from "hooks";
import { FileItem } from "components/shared/form/FileItem";

const editorModules = {
    toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction
        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }, "image"],
        ["clean"], // remove formatting button
    ],
};



export default function DynamicForms({ infos, fields, register, control, errors, tables }) {
    const uploadRef = useRef();
    return (
        <div className="space-y-4">
            {fields.map((info) => {
                let item = infos && infos.find((item) => item.fieldname == info)
                if (item) {
                    return <div key={"field.name"} className="form-group">
                        {(() => {
                            switch (item.fieldtype) {
                                case 'Attach':
                                case 'Attach Image':
                                    return (
                                        <Controller
                                            render={({ field: { value, onChange } }) => {
                                                return <div>
                                                    <Upload onChange={onChange} ref={uploadRef}>
                                                        {({ ...props }) => (
                                                            <Button
                                                                {...props}
                                                                unstyled
                                                                className={clsx(
                                                                    "mt-3 w-full shrink-0 flex-col rounded-lg border-2 border-dashed py-10 border-gray-300 dark:border-dark-450"
                                                                )}
                                                            >
                                                                <CloudArrowUpIcon className="size-12" />
                                                                <span
                                                                    className={clsx(
                                                                        "pointer-events-none mt-2 text-gray-600 dark:text-dark-200"
                                                                    )}
                                                                >
                                                                    <span className="text-primary-600 dark:text-primary-400">
                                                                        Browse
                                                                    </span>
                                                                    <span> or drop your files here</span>
                                                                </span>
                                                            </Button>
                                                        )}
                                                    </Upload>
                                                    {value && <div className="mt-4 flex flex-col space-y-4">
                                                        <div className="relative inline-block">
                                                            <Avatar
                                                                size={24}
                                                                src={`${JWT_HOST_API}${value}`}
                                                                classNames={{ display: "rounded-lg" }}
                                                            />
                                                            <button
                                                                onClick={() => onChange(null)}
                                                                className="absolute -left-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>}
                                                </div>
                                            }}
                                            control={control}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Color':
                                    return (
                                        <Controller
                                            render={({ field: { value, onChange } }) => (
                                                <SketchPicker
                                                    color={value}
                                                    onChange={(val) => onChange(val.hex)}
                                                    placeholder={`Enter the ${item.label}`}
                                                    error={errors[item.fieldname]?.message}
                                                />
                                            )}
                                            control={control}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Data':
                                    return (
                                        <Controller
                                            render={({ field: { value } }) => {
                                                if ((item.label && (item.label.toLowerCase().endsWith('mobile') || item.label.toLowerCase().endsWith('phone') || item.label.toLowerCase().startsWith('mobile') || item.label.toLowerCase().startsWith('phone')))) {
                                                    return <Input
                                                        value={value}
                                                        label={item.label}
                                                        placeholder={`Enter the ${item.label}`}
                                                        component={Cleave}
                                                        options={{
                                                            date: true,
                                                            delimiter: "-",
                                                            datePattern: ["m", "d", "Y"],
                                                        }}
                                                        {...register(item.fieldname)}
                                                        error={errors[item.fieldname]?.message}
                                                    />
                                                } else {
                                                    return <>
                                                        <div className="flex items-center gap-1">
                                                            <Input
                                                                type="text"
                                                                value={value}
                                                                label={item.label}
                                                            />
                                                            {item.description && <ContextualHelp
                                                                content={item.description}
                                                                className="mt-6"
                                                            />}
                                                        </div>
                                                    </>
                                                }
                                            }}
                                            control={control}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Currency':
                                    return (
                                        <Controller
                                            render={({ field: { value } }) => (
                                                <Input
                                                    type="number"
                                                    value={value}
                                                    label={item.label}
                                                    placeholder={`Enter the ${item.label}`}
                                                    {...register(item.fieldname)}
                                                    error={errors[item.fieldname]?.message}
                                                />
                                            )}
                                            control={control}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Check':
                                    return (
                                        <Checkbox
                                            variant="outlined"
                                            label={item.label}
                                            {...register(item.fieldname)}
                                            error={errors[item.fieldname]?.message}
                                        />
                                    );

                                case 'Button':
                                    return (
                                        <Button
                                            color="warning"
                                            {...register(item.fieldname)}
                                            error={errors[item.fieldname]?.message}
                                        >{item.label}</Button>
                                    );

                                case 'Small Text':
                                    return (
                                        <Textarea
                                            rows={4}
                                            label={item.label}
                                            placeholder={`Enter the ${item.label}`}
                                            component={TextareaAutosize}
                                            minRows={4}
                                            maxRows={12}
                                            {...register(item.fieldname)}
                                            error={errors[item.fieldname]?.message}
                                        />
                                    );

                                case 'Text Editor':
                                    return (
                                        <Controller
                                            render={({ field: { value, onChange, ...rest } }) => {
                                                let newValue = typeof value === 'object' ? value.ops[0].insert : (value ? value : '')
                                                const html = `${newValue}`;
                                                console.log(html)
                                                return <TextEditor
                                                    label={item.label}
                                                    value={htmlToDelta(html)}
                                                    // onChange={(val) => onChange(val)}
                                                    placeholder={`Enter ${item.label}`}
                                                    className="mt-1.5 [&_.ql-editor]:max-h-80 [&_.ql-editor]:min-h-[12rem]"
                                                    modules={editorModules}
                                                    error={errors[item.fieldname]?.message}
                                                    {...rest}
                                                />
                                            }}
                                            control={control}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Select':
                                    return (
                                        <Controller
                                            render={({ field: { onChange, value, ...rest } }) => {
                                                const options = item.options ? (item.options).split("\n").map(item => ({ label: item, value: item })) : [];
                                                return <SearchSelect
                                                    onChange={onChange}
                                                    value={value}
                                                    label={item.label}
                                                    lists={options}
                                                    placeholder={`${item.label}`}
                                                    error={errors[item.fieldname]?.message}
                                                    {...rest}
                                                />
                                            }}
                                            control={control}
                                            name={item.fieldname}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Link':
                                    return (
                                        <Controller
                                            render={({ field: { onChange, value, ...rest } }) => (
                                                <SearchSelect
                                                    onChange={onChange}
                                                    value={value}
                                                    label={item.label}
                                                    lists={item.options_list}
                                                    placeholder={`${item.label}`}
                                                    isAddNew={true}
                                                    rootItem={item}
                                                    error={errors[item.fieldname]?.message}
                                                    {...rest}
                                                />
                                            )}
                                            control={control}
                                            name={item.fieldname}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Table':
                                    return (
                                        <Controller
                                            render={({ field: { onChange, value, ...rest } }) => (
                                                <TableBox
                                                    onChange={onChange}
                                                    values={value}
                                                    label={item.label}
                                                    isAddNew={true}
                                                    rootItem={item}
                                                    tableFields={tables ? tables[item.fieldname] : {}}
                                                    error={errors[item.fieldname]?.message}
                                                    {...rest}
                                                />
                                            )}
                                            control={control}
                                            name={item.fieldname}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                case 'Date':
                                    return (
                                        <Controller
                                            render={({ field: { onChange, value, ...rest } }) => {
                                                const onChangeDate = (obj) => {
                                                    const date = new Date(obj[0]);
                                                    date.setDate(date.getDate() + 1);
                                                    const formatted = new Date(date).toISOString().split('T')[0];
                                                    onChange(formatted)
                                                }
                                                return <>
                                                    <label className="text-sm font-medium text-gray-700">{item.label}</label>
                                                    <DatePicker
                                                        onChange={onChangeDate}
                                                        value={value || ""}
                                                        label={item.label}
                                                        isCalendar={true}
                                                        error={errors[item.fieldname]?.message}
                                                        options={{ disableMobile: true }}
                                                        placeholder={`Enter the ${item.label}`}
                                                        {...rest}
                                                    />
                                                </>
                                            }}
                                            control={control}
                                            name={item.fieldname}
                                            {...register(item.fieldname)}
                                        />
                                    );

                                default:
                                    return (
                                        <></>
                                    );
                            }
                        })()}
                    </div>
                }
            })}
        </div>
    );
}