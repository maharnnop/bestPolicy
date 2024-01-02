/*-------------------------------------------------------------------
|  🐼 React FC Input
|
|  🐯 Purpose: RE-USEABLE INPUT COMPOENT
|
|  🐸 Returns:  JSX
*-------------------------------------------------------------------*/

import cn from 'classnames'
import { findInputError } from '../utils/findInputError'
import  {isFormInvalid} from '../utils/isFormInvalid'
import { useFormContext } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { MdError } from 'react-icons/md';
export const Input = ({
  name,
  label,
  type,
  placeholder,
  validation,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const inputErrors = errors[name];

  return (
    <div className={cn('flex flex-col w-full gap-2')}>
      <div className="flex justify-between">
        <label htmlFor={name} className="font-semibold capitalize">
          {label}
        </label>
      </div>
      <input
        id={name}
        type={type}
        className={cn('p-5 font-medium rounded-md w-full border border-slate-300 placeholder:opacity-60')}
        placeholder={placeholder}
        {...register(name, validation)}
      />
      {inputErrors && <p className="text-red-500">{inputErrors.message}</p>}
    </div>
  );
};