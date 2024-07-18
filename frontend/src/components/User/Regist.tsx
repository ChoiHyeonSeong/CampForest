import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg'

type LoginForm = {
        userName: string,
        userBirthdate: Date | null,
        userGender: string,
        phoneNumber: string,
        userEmail: string,
        userPassword: string
}

const Regist = () => {
    const [values, setValues] = useState<LoginForm>({
        userName: "",
        userBirthdate: null,
        userGender: "",
        phoneNumber: "",
        userEmail: "",
        userPassword: ""
    });
    const [isMale, setIsMale] = useState(true);
    const [phoneCertNumber, setPhoneCertNumber] = 
        useState<string | number | readonly string[] | undefined>();
    const [emailCertNumber, setEmailCertNumber] =
        useState<string | number | readonly string[] | undefined>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        })
    };

    return (
        <div className='mt-[3rem] w-[40rem] mx-auto'>
            <div className='text-center pb-[0.75rem] text-[2rem] border-b-2 border-black'>
                회원가입
            </div>
            <form>
                <div className='border-b my-[1.5rem]'>
                    <div className='font-medium mb-[0.25rem]'>이름</div>
                    <input
                        className='focus:outline-none px-[1rem] py-[0.75rem]'
                        placeholder='이름을 입력해주세요.'
                        type="text" 
                        name="userName"
                        value={values.userName}
                        onChange={handleChange}
                    />
                </div>
                <div className='border-b my-[1.5rem]'>
                    <div className='font-medium mb-[0.25rem]'>생년월일</div>
                    <div className='flex'>
                        <DatePicker
                            placeholderText='날짜를 선택해주세요.'
                            className='focus:outline-none px-[1rem] py-[0.75rem]'
                            dateFormat='yyyy.MM.dd'
                            formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                            showYearDropdown
                            showMonthDropdown
                            scrollableYearDropdown
                            shouldCloseOnSelect
                            yearDropdownItemNumber={100}
                            minDate={new Date('1900-01-01')}
                            maxDate={new Date()}
                            selected={values.userBirthdate}
                            onChange={(date) => {
                                setValues({
                                    ...values,
                                    userBirthdate: date,
                                })
                            }}
                        />
                        <div className='flex ms-auto me-[2rem] items-center space-x-[2rem]'>
                            <div className='flex items-center'>
                                <input
                                    className='mx-[0.75rem] size-[1rem] accent-black' 
                                    type='radio'
                                    name='gender'
                                    onChange={(event) => { setIsMale(event.target.checked)}}
                                />
                                <span>남자</span>
                            </div>
                            <div className='flex items-center'>
                                <input 
                                    className='mx-[0.75rem] size-[1rem] accent-black' 
                                    type='radio'
                                    name='gender'
                                    onChange={(event) => { setIsMale(!event.target.checked)}}
                                />
                                <span>여자</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-[1.5rem]'>
                    <div className='font-medium mb-[0.25rem]'>휴대폰 번호</div>
                    <div className='flex space-x-[1.5rem]'>
                        <div className='w-[55%] border-b'>
                            <input
                                className='focus:outline-none px-[1rem] py-[0.75rem]'
                                placeholder='휴대폰 번호 (- 제외)'
                                type="text"
                                maxLength={11}
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='w-[45%] border-b'>
                            <input
                                className='w-[75%] focus:outline-none px-[1rem] py-[0.75rem]'
                                placeholder='인증번호 입력'
                                type='number'
                                name='phoneCertNumber'
                                value={phoneCertNumber}
                                onChange={() => {
                                    setPhoneCertNumber(phoneCertNumber)
                                }}
                            />
                            <button className='transition-all duration-300 rounded-sm w-[20%] h-[1.75rem] text-white bg-[#CCCCCC] hover:bg-[#FF7F50] text-[0.75rem]'>인증</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='font-medium mb-[0.25rem]'>이메일</div>
                    <div className='flex space-x-[1.5rem]'>
                        <div className='w-[55%] border-b'>
                            <input
                                className='focus:outline-none px-[1rem] py-[0.75rem]'
                                placeholder='이메일을 입력해주세요.'
                                type="email" 
                                name="userEmail"
                                value={values.userEmail}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='flex items-center w-[45%] border-b'>
                            <input
                                className='w-[75%] focus:outline-none px-[1rem] py-[0.75rem]'
                                placeholder='인증번호 입력'
                                type="number" 
                                name="emailCertNumber"
                                value={emailCertNumber}
                                onChange={() => {
                                    setEmailCertNumber(emailCertNumber)
                                }}
                                />
                            <button className='transition-all duration-300 rounded-sm w-[20%] h-[1.75rem] text-white bg-[#CCCCCC] hover:bg-[#FF7F50] text-[0.75rem]'>인증</button>
                        </div>
                    </div>
                </div>
                <div className='border-b mt-[1.5rem]'>
                    <div className='font-medium mb-[0.25rem]'>비밀번호</div>
                    <input
                        className='focus:outline-none px-[1rem] py-[0.75rem]'
                        placeholder='비밀번호를 입력해주세요.'
                        type="text" 
                        name="userPassword"
                        value={values.userPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className='text-xs my-[0.25rem]'>8~16자, 영문 대소문자, 숫자, 특수문자 2종류 이상 사용해주세요.</div>
                <div className='border-b my-[1rem]'>
                    <input
                        className='focus:outline-none px-[1rem] py-[0.75rem]'
                        placeholder='비밀번호 확인'
                        type="text" 
                        name="userPassword"
                        value={values.userPassword}
                        onChange={handleChange}
                    />
                </div>
            </form>
            <div className='flex items-center mx-3'>
                <input
                    className='size-[1rem] accent-black'
                    type='checkbox'
                />
                <span className='ms-6 font-bold text-[1rem]'>모든 약관에 동의합니다.</span>
                <ArrowBottomIcon className='ms-auto'/>
            </div>
            <div className='text-center'>
                <button className='mt-[5rem] border-2 border-black font-bold w-[11rem] h-[2.5rem] hover:bg-black hover:text-white transition-all duration-300'>다음</button>
            </div>
        </div>
    )
}

export default Regist