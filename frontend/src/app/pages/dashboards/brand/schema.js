// Import Dependencies
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as Yup from 'yup'

// ----------------------------------------------------------------------

dayjs.extend(isBetween)

export const brandInfoSchema = Yup.object().shape({
    // Personal Information
    brand_name: Yup.string()
        .trim()
        .required('Brand Name Required'),
    category: Yup.string()
        .trim()
        .required('Choose a Category'),
    about_your_brand: Yup.string()
        .trim()
        .required('About Your Brand Required')
})

export const productInfoSchema = Yup.object().shape({
    // Product Information
})