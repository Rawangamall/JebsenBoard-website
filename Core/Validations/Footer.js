const { body } = require("express-validator");


exports.FooterPatch = [
    body('email').isEmail().optional().withMessage('يجب ادخال الايميل الصحيح') ,
    body('location_en').isString().optional(),
    body('location_ar').isString().optional(),
    body('phone_1').isString().optional().withMessage('يجب ادخال رقم الهاتف الاول'),
    body('phone_2').isString().optional().withMessage('يجب ادخال رقم الهاتف الثاني'),
    body('facebooklink').isURL().optional().withMessage("يجب ادخال لينك الفيس"),
    body('instagramlink_1').isURL().optional().withMessage(" يجب ادخال لينك الانستجرام"),
    body('instagramlink_2').isURL().optional().withMessage(" يجب ادخال لينك الانستجرام"),
];

