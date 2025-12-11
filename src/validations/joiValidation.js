import Joi from 'joi';
import AppError from '../utils/AppError.js';


const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        // console.log(req.body, schema, "===> req body in joi validation");
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
};

export const signupSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'ae', 'org', 'io'] }
        })
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    phone: Joi.string().required(),
    password: Joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'))
        .required().messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
        }),
    emiratesId: Joi.number().required(),
    brokerNumber: Joi.number().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'ae', 'org', 'io'] }
        })
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    password: Joi.string().min(6).required(),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'ae', 'org', 'io'] }
        })
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
});

export const verifyOtpSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'ae', 'org', 'io'] }
        })
        .lowercase()
        .trim()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    type: Joi.string().required(),
    enteredOtp: Joi.string().length(6).required(),
});

export const resetPasswordSchema = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'))
        .required().messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
        }),
});

export default validationMiddleware;
