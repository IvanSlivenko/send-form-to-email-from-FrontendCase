"use strict"
//==========================================

async function submitForm(event) {
    event.preventDefault();

    
    const form = event.target;
    const formBtn = document.querySelector('.form__btn');
    const formSendResult = document.querySelector('.form__send-result');
    formSendResult.textContent='';

    const formData = new FormData(form);
    const formDataObject = {};

    formData.forEach((value, key) => {
        formDataObject[key] = value.trim().replace(/\s+/g,'');

    })
    
    console.log(formDataObject)

    const validationErrors = validateForm(formDataObject);

    

    console.log(`Було натиснути на кнопку ${formBtn.textContent}`)
}

function validateForm(formData) {
    const { name, email, phone, message } = formData;

    const phoneRegex = /^\+[0-9]{5,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = [];

    if (!name) {
        errors.push({ field: 'name', message: 'Пожалуйста, введите ваше ФИО.' });
    } else if (name.length < 5 || name.length > 20) {
        errors.push({ field: 'name', message: 'Пожалуйста, введите корректные данные. Пример: Быков Иван Петрович' });
    }

    if (!phone) {
        errors.push({ field: 'phone', message: 'Пожалуйста, введите номер телефона.' });
    } else if (!phoneRegex.test(phone)) {
        errors.push({ field: 'phone', message: 'Пожалуйста, введите корректный номер телефона. Пример: +375257851204' });
    }

    if (!email) {
        errors.push({ field: 'email', message: 'Пожалуйста, введите адрес электронной почты.' });
    } else if (!emailRegex.test(email) || (email.length < 5 || email.length > 100)) {
        errors.push({ field: 'email', message: 'Пожалуйста, введите корректный адрес электронной почты. Пример: frontend@gmail.com' });
    }

    if (!message) {
        errors.push({ field: 'message', message: 'Пожалуйста, введите сообщение.' });
    } else if (message.length < 20 || message.length > 400) {
        errors.push({ field: 'message', message: 'В сообщении должно быть мин. 20 и не более 400 символов.' });
    }
    
    return errors;
}
