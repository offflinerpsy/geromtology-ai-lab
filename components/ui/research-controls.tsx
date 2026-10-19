"use client";

import { Select } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';

type NumberProps = {
  id: string; label: string; unit: string; detail: string; value: string;
  onChange: (value: string) => void; error?: string;
};

/** Text entry deliberately avoids browser steppers and scroll-wheel changes. */
export function ResearchNumber({ id, label, unit, detail, value, onChange, error }: NumberProps) {
  return <div className="research-field" data-invalid={Boolean(error)}>
    <label htmlFor={id}>{label}</label>
    <div className="research-number">
      <input id={id} type="text" inputMode="decimal" autoComplete="off" spellCheck={false}
        value={value} placeholder="Enter value" onChange={event => onChange(event.target.value)}
        aria-invalid={Boolean(error)} aria-describedby={`${id}-unit ${id}-help`}/>
      <span id={`${id}-unit`} className="research-unit">{unit}</span>
    </div>
    <small id={`${id}-help`} className={error ? 'research-field-error' : undefined}>{error || detail}</small>
  </div>;
}

type SelectProps = {
  id: string; name?: string; value: string; onValueChange: (value: string) => void;
  options: { value: string; label: string }[]; disabled?: boolean; label: string;
};

export function ResearchSelect({ id, name, value, onValueChange, options, disabled, label }: SelectProps) {
  return <Select.Root name={name} value={value} onValueChange={onValueChange} disabled={disabled}>
    <Select.Trigger id={id} className="research-select-trigger" aria-label={label}>
      <Select.Value>{options.find(option=>option.value===value)?.label}</Select.Value><Select.Icon><ChevronDown size={16}/></Select.Icon>
    </Select.Trigger>
    <Select.Portal><Select.Content className="research-select-menu" position="popper" sideOffset={7} collisionPadding={16}>
      <Select.Viewport>{options.map(option => <Select.Item className="research-select-option" key={option.value} value={option.value}>
        <Select.ItemText>{option.label}</Select.ItemText><Select.ItemIndicator><Check size={15}/></Select.ItemIndicator>
      </Select.Item>)}</Select.Viewport>
    </Select.Content></Select.Portal>
  </Select.Root>;
}
