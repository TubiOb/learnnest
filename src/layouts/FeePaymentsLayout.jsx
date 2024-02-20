import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PaystackPop from '@paystack/inline-js'
import CustomInput from '../components/CustomInput';
import { toast } from 'sonner'
import Toast from '../components/Toast';
import { addDoc, collection, doc, getDoc, getDocs, where } from 'firebase/firestore';
import { auth, firestore } from '../Firebase';
import CustomTable from '../components/CustomTable';

const FeePaymentsLayout = ({ role }) => {
       // Get role from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    role = queryParams.get('role');



    const [currentUser, setCurrentUser] = useState('');
    const [currentStudent, setCurrentStudent] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [currentStudentId, setCurrentStudentId] = useState('');
    // eslint-disable-next-line
    const [course, setCourse] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    // eslint-disable-next-line
    const [filteredData, setFilteredData] = useState();
    const [filteredCourses, setFilteredCourses] = useState([]);
    // eslint-disable-next-line
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [schoolFees, setSchoolFees] = useState(0);
    const [loading, setLoading] = useState(true);

    const isInputDisabled = true;

    const feeCoumns = ['Course ID', 'Course Name', 'Course Fee']

    const paymentColumns = ['Student ID', 'Student Name', 'Email', 'Department', 'Amount Paid', 'Date'];

    const [feesPaymentData, setFeesPaymentData] = useState([]);
    const [paidSchoolFeesData, setPaidSchoolFeesData] = useState([]);

    const handleRowSelect = (selectedRows) => {
      // console.log('Selected Rows:', selectedRows);
    };

    const handleRowAction = (selectedRow) => {
      // console.log('Row Action:', selectedRow);
    };



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


    const handleSelectCourse = (course) => {
      setSelectedCourse(course);
      setSearchTerm(course.programName);
      setFormData((prevData) => ({
        ...prevData,
        amount: '', // Clear the amount when a course is selected
      }));
    };



    // const handleSelectCourse = (course) => {
    //   // setSearchTerm(course.programName);
    //   try {
    //       if (course.programName.toLowerCase() === searchTerm.toLowerCase()) {
    //           setSearchTerm(course.programName);
    //           // setSelectedInput(course.programName);
    //       }
  
    //       setSelectedCourse(course.programName);
  
    //       setFilteredCourses((prevFilteredCourses) =>
    //           prevFilteredCourses.filter((c) => c !== course)
    //       );
    //   }
    //   catch (err) {
    //       // console.log(err.message);
    //       showToastMessage('Error saving course', 'error');
    //   }
    // };
    



        //   DEFAULT VALUES OF FORM DATA //
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        amount: '',
    });
    



    useEffect(() => {
        const loggedInUser = auth.onAuthStateChanged( async (user) => {
            if (user) {
                let  userUID = user.uid;
    
                setCurrentUserId(userUID);
                const userDocRef = doc(firestore, `Admin`, userUID);
                try {
                    const userData = await getDoc(userDocRef);
    
                    if (userData.exists()) {
                        const userInfo = userData.data();
    
                        if (userInfo) {
                            const loggedUser = userInfo.username;
                            setCurrentUser(loggedUser);
                        }
                    }
                }
                catch (err) {
                    showToastMessage('Admin account not found', 'error');
                    console.error('Error fetching user data:', err);
                }
            }
            else {
                setCurrentUser('')
                // setCurrentUserId('')
            }
        });
        return () => loggedInUser();
    }, [currentUser, currentUserId]);
    
    
    
    
    
    useEffect(() => {
      const loggedInStudent = auth.onAuthStateChanged( async (user) => {
        if (user) {
          let  userUID = user.uid;
  
          setCurrentStudentId(userUID);
          const userDocRef = doc(firestore, `Student`, userUID);
          try {
            const userData = await getDoc(userDocRef);
  
            if (userData.exists()) {
                const userInfo = userData.data();
  
                if (userInfo) {
                    const loggedUser = userInfo.username;
                    const program = userInfo.programName;
                    setCurrentStudent(loggedUser);
                    setCourse(program);
                }
            }
          }
          catch (err) {
              showToastMessage('Student account not found', 'error');
            console.error('Error fetching user data:', err);
          }
        }
        else {
          setCurrentStudent('');
        }
      });
      return () => loggedInStudent();
    }, [currentStudent, currentStudentId]);




    useEffect(() => {
      const fetchCourse = async () => {
        // e.preventDefault();
        try {
            const querySnapshot = await getDocs(collection(firestore, 'Course of Study'));
            const coursesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
  
            const updatedFilteredCourses = coursesData.filter((course) => {
                return course.programName.toLowerCase().includes(searchTerm.toLowerCase());
            });
  
            setFilteredCourses(updatedFilteredCourses);
  
            // console.log('Filtered Courses:', filteredCourses);
        } catch (error) {
            console.error('Error fetching course count:', error);
        }
      };

      fetchCourse();
    }, [searchTerm, filteredCourses]);






    useEffect(() => {
      const fetchFees = async () => {
        try {
          if (currentStudent && currentStudentId && role === 'student') {
            const querySnapshot = await getDocs(collection(firestore, 'Fee Payments'), where('programName', '==', course));

            if (querySnapshot.docs.length > 0) {
              const feePaymentData = querySnapshot.docs[0].data();
              const feeAmount = feePaymentData.amount;

              setSchoolFees(feeAmount);
            }
            else {
              showToastMessage(`No fee payment found for ${course}`);
            }
          }
        }
        catch (err) {
          showToastMessage('Error fetching fees', 'error');
          console.error('Error fetching fees:', err);
        }
      };

      fetchFees();
    }, [currentStudent, currentStudentId, role, course]);
    







    useEffect(() => {
      // Filter data based on the search term
      const filtered = filteredCourses.filter((course) =>
          Object.values(course).some(
              (cell) =>
                  typeof cell === 'string' && cell.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredData(filtered);
    }, [filteredCourses, searchTerm]);






    const handleSave = async (e) => {
      e.preventDefault();

      try {
        if (!selectedCourse) {
          showToastMessage('Please select a course before saving.', 'warning');
          return;
        }

        const paymentDocRef = await addDoc(collection(firestore, 'Fee Payments'), {
          userId: currentUserId,
          createdBy: currentUser,
          courseId: selectedCourse.id,
          amount: formData.amount,
          programName: selectedCourse,
        });

        // setSearchTerm('');
        setFormData({
          amount: '',
        })

        showToastMessage(`Payment saved successfully. Id: ${paymentDocRef.id}`, 'success');
      }
      catch (err) {
        showToastMessage('Error saving payment. Please try again.', 'error');
        console.error('Error saving payment:', err);
      }
    };






    useEffect(() => {
      const fetchFeesPaymentData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'Fees Payments'));
          const data = querySnapshot.docs.map((doc) => {
            const feeData = doc.data();
            return { id: feeData.courseId, courseName: feeData.programName, amount: feeData.amount };
          });
          setFeesPaymentData(data);
          // console.log(feesPaymentData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching Fees Payment Data:', error);
        }
      };
  
      const fetchPaidSchoolFeesData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'Paid School Fees'));
          const data = querySnapshot.docs.map((doc) => {
            const paidFeeData = doc.data();
            return { id: paidFeeData.userId, studentname: paidFeeData.studentName, email: paidFeeData.email, amount: paidFeeData.amount, programName: paidFeeData.programName, paidAt: paidFeeData.paidAt };
          });
          setPaidSchoolFeesData(data);
          setLoading(false);
          // console.log(paidSchoolFeesData);
        } catch (error) {
          console.error('Error fetching Paid School Fees Data:', error);
        }
      };
  
      fetchFeesPaymentData();
      fetchPaidSchoolFeesData();
    }, [feesPaymentData, paidSchoolFeesData]);










    const payWithPaystack = async (e) => {
      e.preventDefault();

      const enteredAmount = parseFloat(formData.amount);

      if (isNaN(enteredAmount) || enteredAmount <= 0) {
        showToastMessage('Please enter a valid and positive amount.', 'warning');
        return;
      }
    
      if (enteredAmount !== schoolFees) {
        showToastMessage('Payment must cover full fees to proceed.', 'warning');
        setFormData({
          amount: '',
        })
        return;
      }

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: 'pk_test_01f2a3b85ad2c0de2272ed4a03b5b817a04d9ecf',
        amount: enteredAmount * 100,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        onSuccess: async (transaction) => {
          let message = `Payment Successful! Reference ${transaction.reference}`
          // alert(message);
          showToastMessage(message, 'success');


          try {
            const fullName = `${formData.firstName} ${formData.lastName}`;

            const paymentData = {
              userId: currentStudentId,
              studentName: fullName,
              email: formData.email,
              amount: enteredAmount,
              programName: selectedCourse.programName,
              paymentReference: transaction.reference,
              // paidAt: new Date(),
            };

                // eslint-disable-next-line
            const paymentDocRef = await addDoc(collection(firestore, 'Paid School Fees'), paymentData);
          }
          catch (err) {
            showToastMessage('Error processing payment. Please try again.', 'error');
            console.error('Error processing payment:', err);
          }
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
        <div className='flex flex-col lg:flex-row items-center justify-between w-full h-screen py-4 px-2 gap-4 lg:gap-2'>
          {role === 'admin' && (
            <React.Fragment>
              <div className='w-full lg:w-[40%] flex flex-col items-start justify-start h-auto lg:h-full p-1 gap-3'>
                <div className='rounded-xl bg-sky-700 text-white w-[90%] md:w-[70%] lg:w-[80%] xl:w-[75%] mx-auto h-auto py-5 px-3 gap-2 flex flex-col items-center justify-center dark:bg-white dark:text-blue-600'>
                  <div className='flex items-center flex-col w-[95%] lg:w-[80%] mx-auto text-center p-2 gap-1'>
                    <h4 className='text-sm lg:text-xl 2xl:text-2xl'>Assign Fees Payments</h4>
                  </div>
                  <form onSubmit={handleSave} id='paymentForm' className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-2.5'>
                    <CustomInput type='text' label='Search' placeholder='Search' value={searchTerm} onChange={(value) => setSearchTerm(value)} className='text-blue-600' />
                    {searchTerm && filteredCourses.length > 0 && (
                      <ul className='bg-blue-100 w-full py-1.5 px-2 -mt-3 rounded-lg text-left gap-0.5'>
                          {filteredCourses.map((course, index) => (
                              <li key={index} onClick={() => handleSelectCourse(course)} className='cursor-pointer hover:text-blue-800 hover:bg-blue-100'>
                                  {course.programName}
                              </li>
                          ))}
                      </ul>
                    )}
                    <CustomInput type="tel" id='amount' label="Amount" placeholder="Amount" value={formData.amount} onChange={handleAmountChange} />

                    <button type="submit" className='text-white px-2 py-2 rounded-xl w-[70%] mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Assign Fee</button>
                  </form>
                </div>
              </div>

              <div className='w-full lg:w-[60%] flex items-start justify-center h-screen'>
                <div className='flex flex-col w-full h-full items-start justify-between gap-3 px-2 py-3 overflow-y-auto'>
                  <div className='flex items-center flex-col gap-2 w-full'>
                    <h3>Course Fees</h3>
                    {loading ? (
                      <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
                    ) : (
                      <CustomTable columns={feeCoumns} data={feesPaymentData} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
                    )}
                  </div>
                  <div className='flex items-center flex-col gap-2 w-full'>
                    <h3>Fee Payment Roster</h3>
                    {loading ? (
                      <p className='text-xs md:text-sm lg:text-base xl:text-xl text-blue-600 dark:text-white'>Loading...</p>
                    ) : (
                      <CustomTable columns={paymentColumns} data={paidSchoolFeesData} onRowSelect={handleRowSelect} onRowAction={handleRowAction} />
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
          {role === 'student' && (
            <React.Fragment>
              <div className='w-full lg:w-[40%] flex flex-col items-center justify-center lg:items-start lg:justify-start h-full p-1 gap-3'>
                <div className='rounded-xl bg-sky-700 text-white w-[90%] md:w-[70%] lg:w-[80%] xl:w-[75%] mx-auto h-auto py-5 px-3 gap-2 flex flex-col items-center justify-center dark:bg-white dark:text-blue-600'>
                  <div className='flex items-center flex-col w-[95%] lg:w-[80%] mx-auto text-center p-2 gap-1'>
                    <h4 className='text-sm lg:text-xl 2xl:text-2xl'>Make Payments</h4>
                  </div>
                  <form onSubmit={payWithPaystack} id='paymentForm' className='w-[95%] md:w-[80%] mt-2 flex flex-col justify-between gap-2.5'>
                    <CustomInput type="email" id='email-address' label="Email Address" placeholder="Email Address" value={formData.email} onChange={handleEmailChange} />
                    <CustomInput type="tel" id='amount' label="Fees Amount" placeholder="Fees Amount" value={schoolFees} onChange={''} disabled={isInputDisabled} />
                    <CustomInput type="tel" id='amount' label="Amount" placeholder="Amount" value={formData.amount} onChange={handleAmountChange} />
                    <CustomInput type="text" id='first-name' label="First Name" placeholder="First Name" value={formData.firstName} onChange={handleFirstNameChange} />
                    <CustomInput type="text" id='last-name' label="Last Name" placeholder="Last Name" value={formData.lastName} onChange={handleLastNameChange} />

                    <button type="submit" className='text-white px-2 py-2 rounded-xl w-[70%] mx-auto bg-blue-400 font-semibold shadow-neutral-200 border-neutral-50 shadow-md transition duration-300  hover:font-semibold hover:bg-white hover:text-blue-400 hover:shadow-neutral-300 text-sm md:text-lg flex items-center justify-center' >Pay</button>
                  </form>
                </div>
              </div>

             
            </React.Fragment>
          )}
          
        </div>

        <Toast showToast={showToastMessage} />
    </div>
  )
}

export default FeePaymentsLayout