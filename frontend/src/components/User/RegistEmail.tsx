import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { registRequired, registClear } from '@store/registSlice';

import '../../../node_modules/react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const RegistEmail: React.FC = () => {
  const dispatch = useDispatch();

  const aboutLocation = useLocation();

  useEffect(() => {
    if (aboutLocation.pathname !== './information') {
      dispatch(registClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboutLocation.pathname]);

  const registFormData = useSelector((state: RootState) => state.registStore);

  const birthdate = registFormData.userBirthdate ? new Date(registFormData.userBirthdate) : null;

  const [phoneValidateNumber, setphoneValidateNumber] = useState<string>('');
  const [phoneRequest, setPhoneRequest] = useState<boolean>(true);
  const [emailRequestButton, setEmailRequestButton] = useState<string>('요청');
  const [emailValidateNumber, setEmailValidateNumber] = useState<string>('');
  const [emailRequest, setEmailRequest] = useState<boolean>(true);
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      registRequired({
        userName: name === 'userName' ? value : registFormData.userName,
        userBirthdate: registFormData.userBirthdate,
        userGender: name === 'userGender' ? value : registFormData.userGender,
        phoneNumber: name === 'phoneNumber' ? value : registFormData.phoneNumber,
        userEmail: name === 'userEmail' ? value : registFormData.userEmail,
        userPassword: name === 'userPassword' ? value : registFormData.userPassword,
      }),
    );
  };

  const handleDateChange = (date: Date | null) => {
    dispatch(
      registRequired({
        userName: registFormData.userName,
        userBirthdate: date?.toISOString(),
        userGender: registFormData.userGender,
        phoneNumber: registFormData.phoneNumber,
        userEmail: registFormData.userEmail,
        userPassword: registFormData.userPassword,
      }),
    );
  };

  const requestEmail = async () => {
    try {
      const response = await axios.post('http://192.168.100.167:8080/email/request', {
        email: registFormData.userEmail,
      });
      setEmailRequest(false);
      setEmailRequestButton('인증');
    } catch (error) {
      console.error('이메일 인증 요청 오류:', error);
    }
  };

  const validateEmail = async () => {
    try {
      const response = await axios.post('http://192.168.100.167:8080/email/validation', {
        email: registFormData.userEmail,
        authCode: emailValidateNumber,
      });
      console.log(response);
      setEmailRequest(true);
      setEmailRequestButton('인증완료');
    } catch (error) {
      console.error('이메일 인증 확인 오류:', error);
    }
  };

  return (
    <div>
      <form>
        <div className="border-b my-[3rem] lg:my-[1.5rem]">
          <div className="font-medium mb-[0.25rem]">이름</div>
          <input
            className="focus:outline-none px-[1rem] py-[0.75rem]"
            placeholder="이름을 입력해주세요."
            type="text"
            name="userName"
            value={registFormData.userName}
            onChange={handleChange}
          />
        </div>
        <div className="md:border-b my-[3rem] lg:my-[1.5rem]">
          <div className="font-medium mb-[0.25rem]">생년월일</div>
          <div className="flex md:flex-row flex-col">
            <DatePicker
              placeholderText="날짜를 선택해주세요."
              className="md:border-none w-full border-b focus:outline-none px-[1rem] py-[0.75rem]"
              dateFormat="yyyy.MM.dd"
              formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              shouldCloseOnSelect
              yearDropdownItemNumber={100}
              minDate={new Date('1900-01-01')}
              maxDate={new Date()}
              selected={birthdate}
              onChange={handleDateChange}
            />
            <div className="md:hidden mt-[3rem] mb-[1rem]">성별</div>
            <div className="flex md:ms-auto me-[1rem] items-center space-x-[2rem]">
              <div className="flex items-center">
                <input
                  className="mx-[0.75rem] size-[1rem] accent-black"
                  type="radio"
                  name="userGender"
                  value="M"
                  checked={registFormData.userGender === 'M'}
                  onChange={handleChange}
                />
                <span>남자</span>
              </div>
              <div className="flex items-center">
                <input
                  className="mx-[0.75rem] size-[1rem] accent-black"
                  type="radio"
                  name="userGender"
                  value="F"
                  checked={registFormData.userGender === 'F'}
                  onChange={handleChange}
                />
                <span>여자</span>
              </div>
            </div>
          </div>
        </div>
        <div className="my-[3rem] lg:my-[1.5rem]">
          <div className="font-medium mb-[0.25rem]">휴대폰 번호</div>
          <div className="flex md:flex-row flex-col md:space-x-[1.5rem]">
            <div className="w-full md:mb-0 mb-[1rem] md:w-[55%] border-b">
              <input
                className="focus:outline-none px-[1rem] py-[0.75rem]"
                placeholder="휴대폰 번호 (- 제외)"
                type="text"
                maxLength={11}
                name="phoneNumber"
                value={registFormData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="min-w-[20rem] w-[45%] border-b">
              <input
                className="w-[75%] focus:outline-none px-[1rem] py-[0.75rem]"
                placeholder="인증번호 입력"
                type="number"
                name="phoneValidateNumber"
                value={phoneValidateNumber}
                onChange={(event) => {
                  setphoneValidateNumber(event.target.value);
                }}
              />
              <button className="transition-all duration-300 rounded-sm w-[20%] h-[1.75rem] text-white bg-[#CCCCCC] hover:bg-[#FF7F50] text-[0.75rem]">
                요청
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="font-medium mb-[0.25rem]">이메일</div>
          <div className="flex md:flex-row flex-col md:space-x-[1.5rem]">
            <div className="w-full md:mb-0 mb-[1rem] md:w-[55%] border-b">
              <input
                className="focus:outline-none px-[1rem] py-[0.75rem]"
                placeholder="이메일을 입력해주세요."
                type="email"
                name="userEmail"
                value={registFormData.userEmail}
                onChange={handleChange}
              />
            </div>
            <div className="min-w-[20rem] flex items-center w-[45%] border-b">
              <input
                className="w-[75%] focus:outline-none px-[1rem] py-[0.75rem]"
                placeholder="인증번호 입력"
                type="number"
                name="emailCertNumber"
                value={emailValidateNumber}
                onChange={(event) => {
                  setEmailValidateNumber(event.target.value);
                }}
              />
              <button
                onClick={(event) => {
                  event.preventDefault();
                  emailRequest ? requestEmail() : validateEmail();
                }}
                className={`transition-all duration-300 rounded-sm w-[20%] h-[1.75rem] text-white 
                  ${emailRequest ? 'bg-[#CCCCCC] hover:bg-[#FF7F50]' : 'bg-[#FF7F50] hover:[#FF7F00]'} text-[0.75rem]
                `}
                disabled={emailRequestButton == '인증완료'}
              >
                {emailRequestButton}
              </button>
            </div>
          </div>
        </div>
        <div className="border-b mt-[3rem] lg:mt-[1.5rem]">
          <div className="font-medium mb-[0.25rem]">비밀번호</div>
          <input
            className="focus:outline-none px-[1rem] py-[0.75rem]"
            placeholder="비밀번호를 입력해주세요."
            type="password"
            name="userPassword"
            value={registFormData.userPassword}
            onChange={handleChange}
          />
        </div>
        <div className="text-xs my-[0.25rem]">
          8~16자, 영문 대소문자, 숫자, 특수문자 2종류 이상 사용해주세요.
        </div>
        <div className="border-b my-[1rem]">
          <input
            className="focus:outline-none px-[1rem] py-[0.75rem]"
            placeholder="비밀번호 확인"
            type="password"
            name="userPassword"
            value={repeatPassword}
            onChange={(event) => {
              setRepeatPassword(event.target.value);
            }}
          />
        </div>
      </form>
      <div className="mt-[2rem] flex items-center mx-3">
        <input className="size-[1rem] accent-black" type="checkbox" />
        <span className="ms-6 font-bold text-[1rem]">모든 약관에 동의합니다.</span>
        <ArrowBottomIcon className="ms-auto" />
      </div>
    </div>
  );
};

export default RegistEmail;
