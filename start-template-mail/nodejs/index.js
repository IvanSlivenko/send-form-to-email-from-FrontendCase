
// Валидация данных при обработке POST-запроса от клиента
const validateData = [
  body('name').customSanitizer(trimReplace).notEmpty().withMessage('Нет ФИО.')
    .isLength({ min: 5, max: 50 }).withMessage('ФИО должно быть 5-50 символов.'),
  body('phone').customSanitizer(trimReplace).notEmpty().withMessage('Нет телефона.')
    .matches(/^\+[0-9]{5,15}$/).withMessage('Не корректный телефон.'),
  body('email').customSanitizer(trimReplace).notEmpty().withMessage('Нет Email.')
    .isEmail().isLength({ min: 5, max: 100 }).withMessage('Не корректный Email'),
  body('message').customSanitizer(trimReplace).notEmpty().withMessage('Нет сообщения.')
    .isLength({ min: 20, max: 400 }).withMessage('Сообщение должно быть 20-400 символов.'),
];
