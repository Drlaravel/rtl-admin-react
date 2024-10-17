import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';

import Swal from 'sweetalert2';

// SVG Icons
const LoadingIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const PaymentIcon = () => (
    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
    </svg>
);

const ZarinpalPayment = ({ paymentId }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const showError = (message) => {
        Swal.fire({
            title: 'خطا!',
            text: message,
            icon: 'error',
            confirmButtonText: 'تلاش مجدد',
            customClass: {
                container: 'font-vazir'
            }
        });
    };

    const showSuccess = (message, referenceId) => {
        Swal.fire({
            title: 'پرداخت موفق',
            html: `
                <p>${message}</p>
                <p class="mt-2 text-gray-600">شماره پیگیری: ${referenceId}</p>
            `,
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                container: 'font-vazir'
            }
        }).then(() => {
            navigate('/invoices');
        });
    };

    const showLoading = () => {
        Swal.fire({
            title: 'در حال پردازش...',
            html: 'لطفاً منتظر بمانید',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
            customClass: {
                container: 'font-vazir'
            }
        });
    };

    // تابع شروع پرداخت
    const initiatePayment = async () => {
        setLoading(true);
        showLoading();
        
        try {
            const response = await api.post('/payments/initiate', {
                payment_id: paymentId,
                callback_url: `${window.location.origin}/payment/callback` // اضافه کردن callback_url
            });

            if (response.data.status === 'success') {
                Swal.close();
                window.location.href = response.data.data.payment_url;
            } else {
                showError('خطا در شروع فرآیند پرداخت');
            }
        } catch (err) {
            console.error(err);
            showError(err.response?.data?.message || 'خطا در ارتباط با سرور');
        } finally {
            setLoading(false);
        }
    };

    // تغییر نحوه verify کردن پرداخت
    React.useEffect(() => {
        const authority = searchParams.get('Authority');
        const status = searchParams.get('Status');

        if (authority && status) {
            const verifyPayment = async () => {
                showLoading();
                try {
                    const response = await api.post('/payments/verify', { // تغییر متد به POST
                        Authority: authority,
                        Status: status
                    });

                    if (response.data.status === 'success') {
                        showSuccess(
                            'پرداخت با موفقیت انجام شد',
                            response.data.data.reference_id
                        );
                    } else {
                        showError('پرداخت ناموفق بود');
                        navigate('/payment/failed'); // اختیاری: هدایت به صفحه خطا
                    }
                } catch (err) {
                    showError(err.response?.data?.message || 'خطا در تایید پرداخت');
                    navigate('/payment/failed'); // اختیاری: هدایت به صفحه خطا
                }
            };

            verifyPayment();
        }
    }, [searchParams, navigate]);

    return (
        <button
            onClick={initiatePayment}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <LoadingIcon />
            ) : (
                <>
                    <PaymentIcon />
                    <span>پرداخت آنلاین</span>
                </>
            )}
        </button>
    );
};

export default ZarinpalPayment;