import React from 'react'
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Label, Select } from "semantic-ui-react";
import {DateTimePicker} from 'react-widgets';
import { AnyAaaaRecord } from 'dns';


interface IProps
  extends FieldRenderProps<any, HTMLInputElement>,
    FormFieldProps {}

const DateInput:React.FC<IProps>= ({
    input,
    width,
    options,
    placeholder,
    date = false,
    time = false,
    meta: { touched, error },
    ...rest
  }) => {
    return(
        <Form.Field error={touched && !!error} width={width}>
        <DateTimePicker
            placeholder={placeholder}
            value={input.value || null}
            onChange={input.onChange}
            onBlur={input.onBlur}
            onKeyDown={(e) => e.preventDefault()}
            date={date}
            time={time}
        />
        {touched && error &&(
            <Label basic color='red'>
                {error}
            </Label>
        )}
      </Form.Field>
    )
}

export default DateInput