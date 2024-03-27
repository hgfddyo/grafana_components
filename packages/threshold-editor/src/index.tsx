import { StandardEditorProps } from '@grafana/data';
import {
  Button,
  Checkbox,
  ColorPickerInput,
  Field,
  HorizontalGroup,
  IconButton,
  Input,
  Label,
  VerticalGroup,
} from '@grafana/ui';
import React, { ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Tresholds = TresholdItem[];
export type GradientColor = { uuid: string; color: string };

export type TresholdItem = {
  isGradient: boolean;
  gradientColors: GradientColor[];
  valueFrom: number;
  valueTo: number;
  color: string;
  uuid: string;
  isFromStrict: boolean;
  isToStrict: boolean;
};

type Props = StandardEditorProps<Tresholds>;

const generateDefaultTreshold = (): TresholdItem => {
  return {
    isGradient: false,
    gradientColors: [],
    isFromStrict: false,
    isToStrict: false,
    valueFrom: 0,
    valueTo: 100,
    color: '',
    uuid: uuidv4(),
  };
};

const TresholdItemForm = ({
  item,
  onDelete,
  onChange,
  index,
}: {
  item: TresholdItem;
  onDelete: (uuid: string) => void;
  onChange: (item: TresholdItem) => void;
  index: number;
}) => {
  const handleChange = (value: string | boolean | number, name: string) => {
    const newItem = { ...item, [name]: value };
    onChange(newItem);
  };

  const handleAddGradient = () => {
    const newGradientColor: GradientColor = { uuid: uuidv4(), color: '' };
    const newItem = { ...item, gradientColors: [...item.gradientColors, newGradientColor] };
    onChange(newItem);
  };

  const handleDeleteGradient = (uuid: string) => {
    const newItem = { ...item, gradientColors: item.gradientColors.filter((item) => item.uuid !== uuid) };
    onChange(newItem);
  };

  const handleChangeGradient = (uuid: string, color: string) => {
    const newItem = {
      ...item,
      gradientColors: item.gradientColors.map((item) => (item.uuid === uuid ? { ...item, color } : item)),
    };
    onChange(newItem);
  };

  return (
    <div style={{ marginTop: 20, outline: '1px solid rgba(204, 204, 220, 0.2)', outlineOffset: '5px' }}>
      <VerticalGroup>
        <HorizontalGroup>
          <Label> Treshold №{index + 1} </Label>
        </HorizontalGroup>
        <HorizontalGroup>
          <Checkbox
            value={item.isFromStrict}
            label="from strict"
            name="isFromStrict"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.checked, 'isFromStrict')}
          />
          <Checkbox
            value={item.isToStrict}
            label="to strict"
            name="isToStrict"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.checked, 'isToStrict')}
          />
        </HorizontalGroup>
        <HorizontalGroup>
          <Field label={`${item.isFromStrict ? 'x >' : 'x >='} value`}>
            <Input
              type="number"
              name="valueFrom"
              value={item.valueFrom}
              label="From value"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(parseInt(e.target.value, 10), 'valueFrom')}
            />
          </Field>
          <Field label={`${item.isToStrict ? 'x <' : 'x <='} value`}>
            <Input
              type="number"
              name="valueTo"
              value={item.valueTo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(parseInt(e.target.value, 10), 'valueTo')}
            />
          </Field>
        </HorizontalGroup>
        <HorizontalGroup>
          <Checkbox
            value={item.isGradient}
            label="gradient"
            name="isGradient"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.checked, 'isGradient')}
          />
        </HorizontalGroup>

        {!item.isGradient ? (
          <HorizontalGroup>
            <Field label="Color">
              <ColorPickerInput
                name="color"
                value={item.color}
                color={item.color}
                onChange={(color) => handleChange(color, 'color')}
              />
            </Field>
          </HorizontalGroup>
        ) : null}

        {item.isGradient ? (
          <div style={{marginTop: 5}}>
          <VerticalGroup>
            <Button onClick={handleAddGradient} variant="secondary" icon="plus">
              Add gradient color
            </Button>
            {item.gradientColors.map((item, index) => (
              <div key={item.uuid} style={{marginTop: 5}}>
                <Field label={`Gradient color №${index + 1}`}>
                  <ColorPickerInput
                    name="gradientColor"
                    value={item.color}
                    color={item.color}
                    label="Gradient color"
                    
                    addonAfter={
                      <IconButton
                        size='xxxl'
                        name="trash-alt"
                        tooltip={'Delete gradient color'}
                        onClick={() => handleDeleteGradient(item.uuid)}
                      />
                    }
                    onChange={(color) => handleChangeGradient(item.uuid, color)}
                  />
                </Field>
              </div>
            ))}
          </VerticalGroup></div>
        ) : null}
        <div style={{marginTop: 10}}>
        <Button variant="destructive" onClick={() => onDelete(item.uuid)} icon="trash-alt">
          Delete treshold
        </Button>
        </div>
      </VerticalGroup>
    </div>
  );
};

export const TresholdsEditor = ({ item, value, onChange }: Props) => {
  const handleCreateTreshold = () => {
    onChange([...value, generateDefaultTreshold()]);
  };

  const handleDelete = (uuid: string) => {
    const changedTresholds = value.filter((item) => item.uuid !== uuid);
    onChange([...changedTresholds]);
  };

  const handleChange = (item: TresholdItem) => {
    const idx = value.findIndex((treshold) => treshold.uuid === item.uuid);
    if (idx === -1) {
      return;
    }

    const oldTresholds = value.filter((treshold) => treshold.uuid !== item.uuid);
    oldTresholds.splice(idx, 0, item);
    onChange([...oldTresholds]);
  };

  return (
    <>
      <div style={{ marginTop: 10 }}>
        <Button onClick={handleCreateTreshold} variant="secondary" icon="plus">
          Add treshold
        </Button>
        {value.map((item, idx) => (
          <TresholdItemForm onDelete={handleDelete} index={idx} onChange={handleChange} item={item} key={item.uuid} />
        ))}
      </div>
    </>
  );
};
