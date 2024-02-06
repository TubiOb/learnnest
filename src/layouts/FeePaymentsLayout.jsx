import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PaystackPop from '@paystack/inline-js'
import CustomInput from '../components/CustomInput';
import { toast } from 'sonner'
import Toast from '../components/Toast';

const FeePaymentsLayout = ({ role }) => {
       // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');



    const handleEmailChange = (value) => {
      setFormData((prevData) => ({
          ...prevData,
          email: value,
      }));
    };

    const handleFirstNameChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            firstName: value,
        }));
    };


    const handleLastNameChange = (value) => {
      setFormData((prevData) => ({
          ...prevData,
          lastName: value,
      }));
    };


    const handleAmountChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            amount: value,
        }));
    };



        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        amount: '',
    });



    const payWithPaystack = (e) => {
      e.preventDefault();

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: 'pk_test_01f2a3b85ad2c0de2272ed4a03b5b817a04d9ecf',
        amount: formData.amount * 100,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        onSuccess(transaction) {
          let message = `Payment Successful! Reference ${transaction.reference}`
          // alert(message);
          showToastMessage(message, 'success');

          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            amount: '',
          })
        },
        onCancel () {
          // alert('You have canceled the transaction');
          showToastMessage('Transaction canceled', 'warning');
        }
      })
    };








          //   CONFIGURING TOAST TO TOAST MESSAGE
      const showToastMessage = (message, type) => {
        switch (type) {
            case 'success':
                toast.success(message, {
                    position: 'top-right',
                    duration: 3000,
                    preventDefault: true,
                });
                break;
            case 'error':
                toast.error(message, {
                    position: 'top-right',
                    duration: 3000,
                    preventDefault: true,
                });
                break;
            case 'warning':
                toast.warning(message, {
                    position: 'top-right',
                    duration: 3000,
                    preventDefault: true,
                });
                break;
            default:
                break;
        }
      };







  return (
    <div className='flex items-center justify-center w-full h-full lg:h-screen'>
        <div className='flex flex-col items-center justify-center w-full h-[100%] py-4 px-2 gap-4 lg:gap-2'>
          <div className='rounded-xl bg-blue-400 text-blue-500 w-[90%] md:w-[70%] lg:w-[80%] xl:w-[55%] mx-auto h-auto py-5 px-3 gap-2 flex flex-col items-center justify-center dark:bg-white dark:text-blue-600'>
            <div className='flex items-center flex-col w-[95%] lg:w-[80%] mx-auto text-center p-2 gap-1'>
              <h4 className='text-sm lg:text-xl 2xl:text-2xl'>Make Payments</h4>
            </div>
            <form onSubmit={payWithPaystack} id='paymentForm' className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-2.5'>
              <CustomInput type="email" id='email-address' label="Email Address" placeholder="Email Address" value={formData.email} onChange={handleEmailChange} />
              <CustomInput type="tel" id='amount' label="Amount" placeholder="Amount" value={formData.amount} onChange={handleAmountChange} />
              <CustomInput type="text" id='first-name' label="First Name" placeholder="First Name" value={formData.firstName} onChange={handleFirstNameChange} />
              <CustomInput type="text" id='last-name' label="Last Name" placeholder="Last Name" value={formData.lastName} onChange={handleLastNameChange} />

              <button type="submit" className='text-white px-2 py-2 rounded-xl w-[70%] mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Pay</button>
            </form>
          </div>
        </div>

        <Toast showToast={showToastMessage} />
    </div>
  )
}

export default FeePaymentsLayout