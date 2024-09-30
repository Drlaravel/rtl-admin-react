import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../../api/api';
import Select, { StylesConfig } from 'react-select';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const customStyles: StylesConfig<any, false> = {
    control: (provided) => ({
        ...provided,
        borderColor: 'rgb(61 77 95)',
        borderWidth: '1.5px',
        borderRadius: '5px',
        padding: '0.5rem',
        backgroundColor: 'transparent',
        color: '#ffffff',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#2563eb' : 'white',
        color: state.isFocused ? 'white' : '#0062ff',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#ffffff',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffffff',
    }),
};

interface CreateUserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    mobile: string;
    role: 'admin' | 'user' | 'editor';
    type: 'gold' | 'silver' | 'bronze';
}

interface OptionType {
    value: string;
    label: string;
}

const roles: OptionType[] = [
    { value: 'admin', label: 'ادمین' },
    { value: 'user', label: 'کاربر' },
    { value: 'editor', label: 'نویسنده' },
];

const types: OptionType[] = [
    { value: 'gold', label: 'طلایی' },
    { value: 'silver', label: 'نقره‌ای' },
    { value: 'bronze', label: 'برنزی' },
];

const UserAdd: React.FC = () => {
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm<CreateUserFormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            mobile: '',
            role: 'user',
            type: 'bronze',
        }
    });

    const navigate = useNavigate();

    const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
        return MySwal.fire({ title, text, icon, confirmButtonText });
    };

    const onSubmit = async (data: CreateUserFormData) => {
        try {
            await api.post('/api/users', {
                ...data,
                role: data.role,
                type: data.type,
            });
            showAlert('موفقیت', 'کاربر با موفقیت ایجاد شد.', 'success');
            navigate('/admin/users/list');
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                // خطاهای اعتبارسنجی را از سرور دریافت کنید و به کاربر نمایش دهید
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.keys(validationErrors)
                    .map((key) => `${key}: ${validationErrors[key].join(', ')}`)
                    .join('؛ ');
    
                showAlert('خطا در اعتبارسنجی', errorMessages, 'error');
            } else {
                console.error('Error creating user:', error);
                showAlert('خطا!', 'ایجاد کاربر با مشکل مواجه شد.', 'error');
            }
        }
    };
    

    // Watching password for confirmation
    const password = watch('password');

    return (
        <>
            <Breadcrumb pageName="ایجاد کاربر جدید" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">ایجاد کاربر جدید</h3>
                </div>
                <div className="p-6.5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* نام و ایمیل */}
                        <div className="my-4.5 grid md:grid-cols-2 gap-6">
                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">نام</label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'نام الزامی است.' })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-stroke'}`}
                                    placeholder="نام کاربر"
                                />
                                {errors.name && <p className="text-danger text-3 mt-2.5">{errors.name.message}</p>}
                            </div>

                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">ایمیل</label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'ایمیل الزامی است.',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'ایمیل معتبر نمی‌باشد.',
                                        }
                                    })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.email ? 'border-red-500' : 'border-stroke'}`}
                                    placeholder="ایمیل کاربر"
                                />
                                {errors.email && <p className="text-danger text-3 mt-2.5">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* پسورد و تأیید پسورد */}
                        <div className="my-4.5 grid md:grid-cols-2 gap-6">
                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">رمز عبور</label>
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: 'رمز عبور الزامی است.',
                                        minLength: {
                                            value: 8,
                                            message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.',
                                        },
                                    })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.password ? 'border-red-500' : 'border-stroke'}`}
                                    placeholder="رمز عبور"
                                />
                                {errors.password && <p className="text-danger text-3 mt-2.5">{errors.password.message}</p>}
                            </div>

                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">تأیید رمز عبور</label>
                                <input
                                    type="password"
                                    {...register('password_confirmation', {
                                        required: 'تأیید رمز عبور الزامی است.',
                                        validate: value => value === password || 'پسوردها یکسان نیستند.',
                                    })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.password_confirmation ? 'border-red-500' : 'border-stroke'}`}
                                    placeholder="تأیید رمز عبور"
                                />
                                {errors.password_confirmation && <p className="text-danger text-3 mt-2.5">{errors.password_confirmation.message}</p>}
                            </div>
                        </div>

                        {/* موبایل */}
                        <div className="my-4.5">
                            <label className="block mb-2.5 text-black dark:text-white">موبایل</label>
                            <input
                                type="text"
                                {...register('mobile', {
                                    required: 'شماره موبایل الزامی است.',
                                    pattern: {
                                        value: /^(\+98|0)?9\d{9}$/,
                                        message: 'شماره موبایل معتبر نمی‌باشد.',
                                    },
                                })}
                                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.mobile ? 'border-red-500' : 'border-stroke'}`}
                                placeholder="شماره موبایل"
                            />
                            {errors.mobile && <p className="text-danger text-3 mt-2.5">{errors.mobile.message}</p>}
                        </div>

                        {/* انتخاب نقش کاربر */}
                        <div className="my-4.5">
                            <label className="block mb-2.5 text-black dark:text-white">نقش کاربر</label>
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: 'نقش کاربر الزامی است.' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        styles={customStyles}
                                        options={roles}
                                        placeholder="نقش کاربر را انتخاب کنید"
                                        isClearable
                                        value={roles.find((option) => option.value === field.value)}
                                        onChange={(selected) => field.onChange(selected ? selected.value : '')}
                                    />
                                )}
                            />
                            {errors.role && <p className="text-danger text-3 mt-2.5">{errors.role.message}</p>}
                        </div>

                        {/* انتخاب نوع کاربر */}
                        <div className="my-4.5">
                            <label className="block mb-2.5 text-black dark:text-white">نوع کاربر</label>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'نوع کاربر الزامی است.' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        styles={customStyles}
                                        options={types}
                                        placeholder="نوع کاربر را انتخاب کنید"
                                        isClearable
                                        value={types.find((option) => option.value === field.value)}
                                        onChange={(selected) => field.onChange(selected ? selected.value : '')}
                                    />
                                )}
                            />
                            {errors.type && <p className="text-danger text-3 mt-2.5">{errors.type.message}</p>}
                        </div>

                        <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
                            ایجاد کاربر
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserAdd;
