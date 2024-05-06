import { composeStory } from '@storybook/react';
import { test } from 'vitest'
import { render, screen, expect } from '@storybook/test';
import Meta, { StateWithCode as StateWithCodeStory } from './CustomOption.stories';

const KarnatakaStateOption = composeStory(StateWithCodeStory, Meta);

test('Check if the component generated with correct name and value', () => {
    render(<KarnatakaStateOption />);

    const isSpanElement = screen.getByText('Karnataka')
    expect(isSpanElement).toBeInTheDocument();
});
