import { FC, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { DropdownOpts, Option } from '../App.type';

const Dropdown: FC<DropdownOpts> = ({ options, name }) => {
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<Option>(options[1]);

    const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase())
        })
  
  return (
    <div className="mx-auto h-screen w-52 pt-20 ">
      <Combobox value={selected} onChange={(value) => setSelected(value)}>
        <div className="relative">
          <ComboboxInput
            className={clsx(
              'w-full rounded-lg border-none bg-red-950/5 py-1.5 pr-8 pl-3 text-sm/6 text-green',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            )}
            displayValue={(option: Option) => option.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-black/60 group-data-[hover]:fill-black" />
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
            className="w-[var(--input-width)] rounded-xl border border-black/5 bg-black/5 p-1 [--anchor-gap:var(--spacing-1)] empty:hidden"
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
    </div>
  )
}

export default Dropdown;