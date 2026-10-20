"use client";
import { Select, Slider, ToggleGroup, Tooltip } from 'radix-ui';
import { Check, ChevronDown, Info } from 'lucide-react';

type NumberProps={id:string;label:string;unit:string;detail:string;value:string;onChange:(value:string)=>void;error?:string};
export function ResearchNumber({id,label,unit,detail,value,onChange,error}:NumberProps){
  return <div className="research-field" data-invalid={Boolean(error)}>
    <div className="research-field-label"><label htmlFor={id}>{label}</label><Tooltip.Provider delayDuration={160}><Tooltip.Root>
      <Tooltip.Trigger type="button" className="research-help" aria-label={`About ${label}`}><Info size={13}/></Tooltip.Trigger>
      <Tooltip.Portal><Tooltip.Content className="research-tooltip" sideOffset={8}>{detail}<Tooltip.Arrow/></Tooltip.Content></Tooltip.Portal>
    </Tooltip.Root></Tooltip.Provider></div>
    <div className="research-number"><input id={id} type="text" inputMode="decimal" autoComplete="off" spellCheck={false}
      value={value} placeholder="—" onChange={event=>onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={`${id}-unit ${id}-help`}/>
      <span id={`${id}-unit`} className="research-unit">{unit}</span></div>
    <small id={`${id}-help`} className={error?'research-field-error':'sr-only'}>{error||detail}</small>
  </div>;
}

export function ResearchSegment({value,onValueChange,options,label}:{value:string;onValueChange:(value:string)=>void;options:{value:string;label:string}[];label:string}){
  return <ToggleGroup.Root className="research-segment" type="single" value={value} onValueChange={next=>{if(next)onValueChange(next);}} aria-label={label}>
    {options.map(option=><ToggleGroup.Item key={option.value} value={option.value}>{option.label}</ToggleGroup.Item>)}
  </ToggleGroup.Root>;
}
export function ResearchSlider({id,label,value,min,max,step=1,onValueChange,valueText}:{id:string;label:string;value:number;min:number;max:number;step?:number;onValueChange:(value:number)=>void;valueText?:string}){
  return <Slider.Root className="research-slider" value={[value]} min={min} max={max} step={step} onValueChange={values=>onValueChange(values[0])}>
    <Slider.Track className="research-slider-track"><Slider.Range className="research-slider-range"/></Slider.Track>
    <Slider.Thumb className="research-slider-thumb" id={id} aria-label={label} aria-valuetext={valueText}/>
  </Slider.Root>;
}

type SelectProps={id:string;name?:string;value:string;onValueChange:(value:string)=>void;options:{value:string;label:string}[];disabled?:boolean;label:string};
export function ResearchSelect({id,name,value,onValueChange,options,disabled,label}:SelectProps){
  return <Select.Root name={name} value={value} onValueChange={onValueChange} disabled={disabled}>
    <Select.Trigger id={id} className="research-select-trigger" aria-label={label}><Select.Value>{options.find(option=>option.value===value)?.label}</Select.Value><Select.Icon><ChevronDown size={15}/></Select.Icon></Select.Trigger>
    <Select.Portal><Select.Content className="research-select-menu" position="popper" align="start" sideOffset={6} collisionPadding={16}>
      <Select.Viewport>{options.map(option=><Select.Item className="research-select-option" key={option.value} value={option.value}><Select.ItemText>{option.label}</Select.ItemText><Select.ItemIndicator><Check size={14}/></Select.ItemIndicator></Select.Item>)}</Select.Viewport>
    </Select.Content></Select.Portal>
  </Select.Root>;
}
