import type { Meta, StoryObj } from '@storybook/react';
import { userEvent } from '@storybook/test';
import { within, expect, } from '@storybook/test';
import CustomOption from '../core/CustomOption';

const meta: Meta<typeof CustomOption>  = {
    title: 'Core/CustomOption',
    component: CustomOption,
    tags: ['autodocs']
}

export default meta;
type Story = StoryObj<typeof meta>;

export const StateWithCode: Story = {
    args: {
        name: 'Karnataka',
        value: 'KA',
        action: function (value: string) {
            alert(`This option Karnataka will be removed: [${value}]`);
        }
    }
};

export const CategoryWSameVal: Story = {
    args: {
        name: 'Dessert',
        value: 'Dessert'
    }
};

export const LongProductNameWithID: Story = {
    args: {
        name: 'South Indian Chicken Curry And Roti [3 Pieces]',
        value: 'RCC17NVSICCAR-3P-1'
    }
};

export const RemoveOption: Story = {
    args: {
        name: 'Karnataka',
        value: 'KA',
        action: function (value: string) {
            alert(`This option Karnataka will be removed: [${value}]`);
        }
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const KAOption = canvas.getByText('Karnataka');
      await expect(KAOption).toBeInTheDocument();

      const option = KAOption.parentElement?.parentElement;
      await expect(option).toHaveClass('bg-slate-50');

      await userEvent.hover(KAOption);
      
      await expect(option).toHaveClass('hover:bg-slate-300');

      
    },
  };
