/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { IconButton, Menu } from '@/components';
import { useResizeObserver } from '@/features/common/hooks/useResizeObserver';
import { Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { ReactNode, useRef } from 'react';
import { HiDotsVertical } from 'react-icons/hi';

export type Action<T = any> = {
  id: string;
  label: ReactNode;
  icon: ReactNode;
  onClick: (...props: T[]) => void;
  onMouseEnter?: (...props: T[]) => void;
  width?: number;
  render?: (...props: T[]) => ReactNode;
};

interface ActionsDisplayerProps {
  actions?: Action[];
  buttonWidth?: number;
}

const ActionsDisplayer = ({ actions = [], buttonWidth = 40 }: ActionsDisplayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver(containerRef);
  const reservedWidth = buttonWidth; // Width reserved for the menu button when necessary

  let cumulativeWidth = 0;
  const visibleActions: Action[] = [];
  let index = 0;

  if (containerWidth === 0) {
    visibleActions.push(...actions);
  } else {
    for (; index < actions.length; index++) {
      const currentActionWidth = actions[index].width || buttonWidth;
      // If the current action fits, we add it to visibleActions and add its width to the accumulated.
      if (cumulativeWidth + currentActionWidth + reservedWidth <= containerWidth) {
        visibleActions.push(actions[index]);
        cumulativeWidth += currentActionWidth;
      } else {
        break;
      }
    }
  }

  const overflowActions = index < actions.length ? actions.slice(index) : [];

  return (
    <HStack ref={containerRef} display='flex' justifyContent='flex-end' flexGrow='1'>
      <HStack gap='0'>
        {visibleActions.map((action) => {
          if (action.render) return action.render(action);
          return <ActionIconButton key={action.id} action={action} />;
        })}
        {overflowActions.length > 0 && <ActionsMenu actions={overflowActions} />}
      </HStack>
    </HStack>
  );
};

export default ActionsDisplayer;

interface ActionIconButtonProps {
  action: Action;
}

const ActionIconButton = ({ action }: ActionIconButtonProps) => {
  return (
    <IconButton
      label={action.label}
      onClick={action.onClick}
      onMouseEnter={action.onMouseEnter}
      variant='ghost'
      size={{ base: 'md', smDown: 'sm' }}
      icon={action.icon}
    />
  );
};

const ActionInsideMenu = ({ action }: ActionIconButtonProps) => {
  return (
    <Flex onClick={action.onClick} align='center' py='0.5' px='1.5' gap='2'>
      <Icon size='sm'>{action.icon}</Icon>
      <Text>{action.label}</Text>
    </Flex>
  );
};

interface ActionsMenuProps {
  actions: Action[];
}

const ActionsMenu = ({ actions }: ActionsMenuProps) => {
  return (
    <Menu
      trigger={<IconButton label='Más acciones' variant='ghost' icon={<HiDotsVertical />} />}
      items={actions}
      render={(action) => {
        if (action.render) return action.render(action);
        return <ActionInsideMenu key={action.id} action={action} />;
      }}
    />
  );
};
