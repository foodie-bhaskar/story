import { FC, useEffect, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition, Field } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { DropdownOpts, Option } from '../App.type';

const Dropdown: FC<DropdownOpts> = ({ options, name, selectedValue, selectedCallback, readOnly }) => {
  let borderOn = false;
  // borderOn = true;
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Option>(options.find(o => o.value === selectedValue) || options[0]);

  const filteredOptions =
  query === ''
    ? options.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    : options.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).filter((option) => {
        return option.name.toLowerCase().includes(query.toLowerCase())
      });

  useEffect(() => {
    if (selectedValue) {
      let o = options.find(o => o.value === selectedValue);

      if (o) {
        setSelected(o)
      }
    }
  }, [selectedValue])

  return (
    <div className={`${borderOn ? 'border border-blue-700': ''} group-has-[:checked]/toggle:-mt-8 max-w-80`}>
      <label className="block text-sm font-medium leading-6 text-gray-600 ">
        {name}
      </label>
      <div className='mt-2'>
        <Field disabled={readOnly}>
          <Combobox value={selected} onChange={(value: Option) => {
            console.log(value);
            setSelected(value);

            if (selectedCallback && typeof selectedCallback == 'function') {
              selectedCallback(value);
            }
          }}>
            <div className="relative">
              <ComboboxInput
                className={clsx(
                  `w-full rounded-lg border-none ${readOnly ? ' bg-slate-100': 'bg-red-950/5'} 
                  py-1.5 pr-8 pl-3 text-sm/6  ${readOnly ? 'text-gray-400': 'text-black'}`,
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
                )}
                displayValue={(option: Option) => option.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                <ChevronDownIcon className={`size-4 fill-black/${ readOnly? 20 : 60} group-data-[hover]:fill-black`} />
              </ComboboxButton>
            </div>
            <Transition
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <ComboboxOptions
                anchor="bottom"
                className="w-[var(--input-width)] rounded-xl border border-black/5 bg-slate-50 p-1 [--anchor-gap:var(--spacing-1)] empty:hidden"
              >
                {filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option.value}
                    value={option}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10"
                  >
                    <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                    <div className="text-sm/6 text-black">{option.name}</div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Transition>
          </Combobox>
        </Field>
      </div>
    </div>
  )
}

export function isDropdown(component: any): component is typeof Dropdown {
  
  return (
      component &&
      typeof component === 'object' &&
      component instanceof Dropdown // Use instanceof instead of typeof
  );
}

export default Dropdown;