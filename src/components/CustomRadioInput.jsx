import React from 'react'
import { Radio, RadioGroup as ChakraRadioGroup, Stack } from '@chakra-ui/react'

const CustomRadioInput = ({ options, label, value, onChange }) => {
  return (
    <div>
        <label className='font-medium text-base'>{label}</label>
        <ChakraRadioGroup value={value} onChange={onChange}>
            <Stack direction='row' gap='3'>
                {options.map((option) => (
                    <Radio key={option.value} value={option.value} className='ml-2'>
                        {option.label}
                    </Radio>
                ))}
            </Stack>
        </ChakraRadioGroup>
    </div>
  )
}

export default CustomRadioInput