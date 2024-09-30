import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../../api/api';
import Select, { StylesConfig } from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';

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

interface UpdateUserFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
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

const UserEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<UpdateUserFormData>({
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

    const password = watch('password');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/api/users/${id}`);
                const userData = response.data.data;
                console.log(userData)
                setValue('name', userData.name);
                setValue('email', userData.email);
                setValue('mobile', userData.mobile);
                setValue('role', userData.roles?.[0]?.name || 'user');
                setValue('type', userData.type);
                // خالی کردن فیلدهای رمز عبور
                setValue('password', '');
                setValue('password_confirmation', '');
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [id, setValue]);

    const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
        return MySwal.fire({ title, text, icon, confirmButtonText });
    };

    const onSubmit = async (data: UpdateUserFormData) => {
        try {
            const { password, password_confirmation, ...restData } = data;

            // آماده‌سازی داده‌هایی که به سرور ارسال می‌شوند
            const updateData: any = {
                ...restData,
                role: data.role,
                type: data.type,
            };

            // اگر کاربر رمز عبور جدیدی وارد کرده باشد، آن را به داده‌های ارسالی اضافه کنید
            if (password) {
                updateData.password = password;
                updateData.password_confirmation = password_confirmation;
            }

            await api.put(`/api/users/${id}`, updateData);

            showAlert('موفقیت', 'کاربر با موفقیت به‌روزرسانی شد.', 'success');
            navigate('/admin/users/list');
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.keys(validationErrors)
                    .map((key) => `${key}: ${validationErrors[key].join(', ')}`)
                    .join('؛ ');
                showAlert('خطا در اعتبارسنجی', errorMessages, 'error');
            } else {
                console.error('Error updating user:', error);
                showAlert('خطا!', 'به‌روزرسانی کاربر با مشکل مواجه شد.', 'error');
            }
        }
    };

    return (
        <>
            <Breadcrumb pageName="ویرایش کاربر" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">ویرایش کاربر</h3>
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
                                        validate: value => {
                                            if (password) {
                                                if (!value) {
                                                    return 'تأیید رمز عبور الزامی است.';
                                                }
                                                if (value !== password) {
                                                    return 'پسوردها یکسان نیستند.';
                                                }
                                            }
                                            return true;
                                        },
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
                            به‌روزرسانی کاربر
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserEdit;
