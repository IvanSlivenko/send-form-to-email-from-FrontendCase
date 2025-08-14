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

    displayErrors(validationErrors);
        if(validationErrors.length > 0) return;

    

    console.log(`Було натиснути на кнопку ${formBtn.textContent}`)
}

function displayErrors(errors){
    const errorElement = document.querySelectorAll('.form__error');
    errorElement.forEach((errorElement) => errorElement.textContent='')

    if(errors.length < 1) return;

    errors.forEach((error)=>{
        const {field, message} = error;
        const errorElement = document.querySelector(`[data-for="${field}"]`);
        errorElement.textContent = message;
    })
}

function validateForm(formData) {
    const { name, email, phone, message } = formData;

    const phoneRegex = /^\+[0-9]{5,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = [];

    if (!name) {
        errors.push({ field: 'name', message: 'Будь-ласка введіть ваше ПІП.' });
    } else if (name.length < 5 || name.length > 20) {
        errors.push({ field: 'name', message: 'Будь-ласка, введіть корректні відомості. Наприклад: Биков Іван Петрович' });
    }

    if (!phone) {
        errors.push({ field: 'phone', message: 'Будь-ласка, введіть номер телефону.' });
    } else if (!phoneRegex.test(phone)) {
        errors.push({ field: 'phone', message: 'Будь-ласка, введіть корректний номер телефону. Наприклад: 067 470 87 21' });
    }

    if (!email) {
        errors.push({ field: 'email', message: 'Будь-ласка, введіть адресу электронної пошти.' });
    } else if (!emailRegex.test(email) || (email.length < 5 || email.length > 100)) {
        errors.push({ field: 'email', message: 'Будь-ласка, введіть корректну адресу электронної пошти. Наприклад: frontend@gmail.com' });
    }

    if (!message) {
        errors.push({ field: 'message', message: 'Будь-ласка введіть повідомлення.' });
    } else if (message.length < 20 || message.length > 400) {
        errors.push({ field: 'message', message: 'В повідомленні має бути мін. 20 і не більше 400 символів.' });
    }
    
    return errors;
}
