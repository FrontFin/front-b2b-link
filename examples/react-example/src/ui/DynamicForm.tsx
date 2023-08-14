import React from 'react'
import { Formik, Form, FieldArray, FieldArrayRenderProps } from 'formik'
import Select from 'react-select'
import { NetworkResponseWithIntegrations as Network } from '@front-finance/api'

export const defaultNetworks: Network[] = [
  {
    id: '7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12',
    name: 'Polygon',
    supportedTokens: ['MATIC', 'USDT', 'USDC']
  },
  {
    id: '03dee5da-7398-428f-9ec2-ab41bcb271da',
    name: 'Bitcoin',
    supportedTokens: ['BTC']
  },
  {
    id: 'e3c7fdd8-b1fc-4e51-85ae-bb276e075611',
    name: 'Ethereum',
    supportedTokens: ['ETH', 'MATIC', 'USDT', 'USDC']
  },
  {
    id: '0291810a-5947-424d-9a59-e88bb33e999d',
    name: 'Solana',
    supportedTokens: ['SOL', 'USDT', 'USDC']
  }
]

export interface ToAddress {
  networkId: string
  symbol: string
  address: string
}

export interface FormValues {
  toAddresses: ToAddress[]
}

interface DynamicFormProps {
  networks: Network[]
  setOutput: (output: FormValues) => void
}

const toOption = (value: string) => ({ value, label: value })

const DynamicForm: React.FC<DynamicFormProps> = ({ networks, setOutput }) => (
  <Formik
    initialValues={{
      toAddresses: [{ networkId: '', symbol: '', address: '' }] as ToAddress[]
    }}
    onSubmit={setOutput}
  >
    {({ values, setFieldValue, setFieldTouched }) => (
      <Form>
        <FieldArray name="toAddresses">
          {({ push }: FieldArrayRenderProps) => (
            <div>
              {values.toAddresses.map((line, index) => {
                const selectedNetwork = networks.find(
                  network => network.id === line?.networkId
                )
                const options = selectedNetwork
                  ? selectedNetwork?.supportedTokens?.map(toOption)
                  : []
                const networkOptions = networks.map(network => ({
                  value: network.id,
                  label: network.name
                }))

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}
                  >
                    <div style={{ width: '30%' }}>
                      <Select
                        name={`toAddresses.${index}.networkId`}
                        onChange={option => {
                          setFieldValue(`toAddresses.${index}.symbol`, '')
                          setFieldValue(
                            `toAddresses.${index}.networkId`,
                            option ? option.value : ''
                          )
                        }}
                        onBlur={() =>
                          setFieldTouched(`toAddresses.${index}.networkId`)
                        }
                        options={networkOptions}
                        isClearable
                      />
                    </div>
                    <div style={{ width: '30%' }}>
                      <Select
                        name={`toAddresses.${index}.symbol`}
                        onChange={option =>
                          setFieldValue(
                            `toAddresses.${index}.symbol`,
                            option ? option.value : ''
                          )
                        }
                        onBlur={() =>
                          setFieldTouched(`toAddresses.${index}.symbol`)
                        }
                        options={options}
                        isClearable
                      />
                    </div>
                    <div style={{ width: '30%' }}>
                      <input
                        style={{
                          borderRadius: 4,
                          minHeight: 34,
                          width: '100%',
                          borderColor: 'hsl(0, 0%, 80%)'
                        }}
                        type="text"
                        name={`toAddresses.${index}.address`}
                        onChange={event => {
                          setFieldValue(
                            `toAddresses.${index}.address`,
                            event.target.value
                          )
                        }}
                        onBlur={() =>
                          setFieldTouched(`toAddresses.${index}.address`)
                        }
                        placeholder="Address"
                      />
                    </div>
                  </div>
                )
              })}
              <button
                type="button"
                onClick={() => push({ networkId: '', symbol: '', address: '' })}
              >
                Add Line
              </button>
              <button type="submit">Submit</button>
            </div>
          )}
        </FieldArray>
      </Form>
    )}
  </Formik>
)

export default DynamicForm
