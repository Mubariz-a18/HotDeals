const jsonData = require('../json.json');
const catSubCat = require('../utils/categorySubcategory');

function getPostFors(cat, subCat) {
    if (cat !== 'Properties') {
        return [];
    }
    const postfors = jsonData[cat][subCat][0]['Post for'][0]['subFields']
        .map(e => e.toString())
        // .toList();
    return postfors;
};

function validateFields({ formFields, selectFields }) {
    const validRequiredFields = validateRequiredFields({ formFields, selectFields });

    if (!validRequiredFields) {
        return false;
    }

    for (const key in selectFields) {
        if (key === 'Post for') {
            continue;
        }

        if (!formFields.hasOwnProperty(key)) {
            return false;
        }

        const value = selectFields[key];

        const field = formFields[key];

        const validValue = validateValue({ field, selectedValue: value, key });

        if (!validValue) {
            return false;
        }
    }

    return true;
};

function validateRequiredFields({ formFields, selectFields }) {
    for (const key in formFields) {
        if (!selectFields.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
};

function validateValue({ field, key, selectedValue }) {
    const enumType = field['enumType'];

    switch (enumType) {
        case 'textField':
            return validateTextFieldValue({ field, key, selectedValue });

        case 'singleSelect':
            return validateSingleSelectValue({ field, key, selectedValue });

        case 'multiSelect':
            return validateMultiSelectValue({ field, key, selectedValue });

        case 'textFieldWithDropDown':
            return validateTextFieldWithDropDownValue({ field, key, selectedValue });

        case 'nestedFields':
            return validateNestedFields({ field, key, selectedValue });

        default:
            return true;
    }
};

function validateTextFieldValue({ field, key, selectedValue }) {
    if (typeof selectedValue !== 'string') {
        return false;
    }

    const requiredField = field['required'] || false;

    if (requiredField && selectedValue.length === 0) {
        return false;
    }

    if (!requiredField && selectedValue.length === 0) {
        return true;
    }

    const maxLength = field['characterRestrict'];

    if (maxLength !== null && selectedValue.length > maxLength) {
        return false;
    }

    if (key.includes('MM/YYYY')) {
        const validDate = validateSelectedValueDate(selectedValue);

        // if (!validDate) return false;
        return validDate;
    }

    const type = field['type'];
    const textType = field['textType'];

    if (type === 'number' || textType === 'number') {
        const validNumber = validateNumber(selectedValue);
        if (!validNumber) {
            return false;
        }
    }

    if (key === 'Company Website') {
        const validUrl = validateWebsite(selectedValue);

        if (!validUrl) {
            return false;
        }
    }

    if (type !== 'number' && textType !== 'number' && key !== 'Company Website') {
        const validText = validateText(selectedValue);

        if (!validText) {
            return false;
        }
    }

    return true;
};

function validateNestedFields(field, key, selectedValue) {
    if (!(selectedValue instanceof Map)) return false;

    for (let i = 0; i < selectedValue.length; i++) {
        const key = Array.from(selectedValue.keys())[i];

        if (typeof key !== 'string') return false;

        const fields = field['fields'];

        const validKey = validateFieldInNestedFields({ fields, key });

        if (!validKey) return false;

        const value = selectedValue.get(key) || '';

        if (typeof value !== 'string') return false;

        const nestedField = getNestedField({ fields, key });

        const validNestedField = validateTextFieldValue({
            field: nestedField,
            key,
            selectedValue: value,
        });

        if (!validNestedField) return false;
    }

    return true;
};

function getNestedField({ fields, key }) {
    let nestedField = {};

    for (let field of fields) {
        if (Object.keys(field)[0] === key) {
            nestedField = field;
            break;
        }
    }

    return nestedField;
};

function validateFieldInNestedFields(fields, key) {
    const keys = fields.map(field => Object.keys(field)[0]);
    return keys.includes(key);
};

function validateTextFieldWithDropDownValue({ field, key, selectedValue }) {
    if (!(selectedValue instanceof Object)) return false;

    const type = field.type;
    const textType = field.textType;

    const value = selectedValue.value;

    if (typeof value !== "string") return false;

    const maxLength = field.characterRestrict;

    if (maxLength !== null && value.length > maxLength) return false;

    if (type === "number" || textType === "number") {
        const validNumber = validateNumber(value);
        if (!validNumber) return false;
    }

    if (type !== "number" && textType !== "number") {
        const validText = validateText(value);

        if (!validText) return false;
    }

    const unit = selectedValue.unit;

    if (typeof unit !== "string") return false;

    const units = field.fields;

    if (!units.includes(unit)) return false;

    return true;
};

function validateMultiSelectValue({ field, key, selectedValue }) {
    if (!Array.isArray(selectedValue)) {
        return false;
    }

    const values = field.fields;

    for (const value of selectedValue) {
        if (!values.includes(value)) {
            return false;
        }
    }

    return true;
};

function validateSingleSelectValue({ field, key, selectedValue }) {
    if (typeof selectedValue !== 'string') {
        return false;
    }

    const values = field.fields;

    if (!values.includes(selectedValue)) {
        return false;
    }

    return true;
};

function validateNumber(value) {
    return /^[0-9,.]+$/.test(value);
};

function validateWebsite(value) {
    return /^[0-9a-zA-Z ,.@:\/]+$/.test(value);
};

function validateText(value) {
    return /^[0-9a-zA-Z ,.@]+$/.test(value);
};

function validateSelectedValueDate(value) {
    let validDate = false;
    const components = value.split("/");
    if (components.length === 2) {
        const month = parseInt(components[0]);
        const year = parseInt(components[1]);
        if (!isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month - 1);
            if (date.getFullYear() === year && date.getMonth() === month - 1) {
                validDate = true;
            }
            if (date > new Date()) {
                validDate = false;
            }
            if (year < 1900) {
                validDate = false;
            }
        }
        if (components[1].length !== 4) {
            validDate = false;
        }
    }
    return validDate;
};

// Main Validator

function ValidateSelectFields({ cat, subCat, selectFields }) {

    const catNames = Object.keys(catSubCat);
    if (!(catNames.includes(cat) && catSubCat[cat].includes(subCat))) return false;

    if (cat === 'Properties') {
        const postFors = getPostFors(cat, subCat);
        const selectedPostFor = selectFields['Post for'];

        if (typeof selectedPostFor !== 'string') {
            return false;
        }

        if (!postFors.includes(selectedPostFor)) {
            return false;
        }

        const formFields = jsonData[cat][subCat][0]['Post for'][0][selectedPostFor][0];
        const validFields = validateFields({ formFields, selectFields });
        return validFields;
    }

    const formFields = jsonData[cat][subCat][0];

    if(!formFields) return false;

    const validFields = validateFields({ formFields, selectFields });

    return validFields;
};

module.exports = ValidateSelectFields