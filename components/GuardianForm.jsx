import { Input } from 'antd'
import React, { useMemo } from 'react'
import InputLabel from './InputLabel'

const GuardianForm = ({ selectedChild, setSelectedChild }) => {
	const { guardian } = useMemo(() => selectedChild || null, [selectedChild])

	const handleInputChange = (val, property) => {
    let full_name = guardian?.full_name
    if(property === 'first_name') {
      full_name = `${val} ${guardian?.last_name}`
    }
    if(property === 'last_name') {
      full_name = `${guardian?.first_name} ${val}`
    }

    setSelectedChild(child => (
      {
        ...child,
        guardian: {
					...guardian,
					[property]: val,
        	full_name
				}
      }
    ))
  }

	return (
		<div>
			<InputLabel label="First Name" />
			<Input
				placeholder="First Name"
				onChange={(e) => handleInputChange(e.target.value, 'first_name')}
				value={guardian?.first_name || null}
			/>
			<InputLabel label="Last Name" marginTop='mt-3' />
			<Input
				placeholder="Last Name"
				onChange={(e) => handleInputChange(e.target.value, 'last_name')}
				value={guardian?.last_name || null}
			/>
			<InputLabel label="Email" marginTop='mt-3' />
			<Input
				placeholder="Email"
				onChange={(e) => handleInputChange(e.target.value, 'email')}
				value={guardian?.email || null}
			/>
			<InputLabel label="Phone Number" marginTop='mt-3' />
			<Input
				placeholder="Phone Number"
				onChange={(e) => handleInputChange(e.target.value, 'phone_number')}
				value={guardian?.phone_number || null}
			/>
		</div>
	)
}

export default GuardianForm