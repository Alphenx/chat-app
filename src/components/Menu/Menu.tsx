import List from '@/components/List/List';
import { Menu as ChakraMenu, Portal } from '@chakra-ui/react';
import { ReactNode } from 'react';

type SingleItem<T> = T & { id: string } & { type?: 'single' };
type GroupItem<T> = T & { id: string } & { type: 'group'; label?: string; items: MenuEntry<T>[] };

export type MenuEntry<T> = T & (SingleItem<T> | GroupItem<T>);

interface MenuProps<T> {
  trigger: ReactNode;
  items: MenuEntry<T>[];
  render?: (item: MenuEntry<T>, index: number, items: MenuEntry<T>[]) => ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

function Menu<T>({ trigger, items, render, onOpen, onClose }: MenuProps<T>) {
  return (
    <ChakraMenu.Root
      onOpenChange={({ open }) => {
        if (open) onOpen?.();
        else onClose?.();
      }}
    >
      <ChakraMenu.Trigger asChild>{trigger}</ChakraMenu.Trigger>
      <Portal>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content>
            <List
              items={items}
              render={(entry, idx, items) => {
                if (entry.type === 'group') {
                  return <GroupedItems<T> entry={entry} render={render} />;
                }

                return (
                  <ChakraMenu.Item key={entry.id} value={entry.id} asChild>
                    {render ? render(entry, idx, items) : entry.id}
                  </ChakraMenu.Item>
                );
              }}
            />
          </ChakraMenu.Content>
        </ChakraMenu.Positioner>
      </Portal>
    </ChakraMenu.Root>
  );
}

export default Menu;

function GroupedItems<T>({
  entry,
  render,
}: {
  entry: GroupItem<T>;
  render?: (item: MenuEntry<T>, index: number, items: MenuEntry<T>[]) => ReactNode;
}): ReactNode {
  return (
    <ChakraMenu.ItemGroup key={entry.id}>
      <ChakraMenu.Separator />
      {entry.label && <ChakraMenu.ItemGroupLabel>{entry.label}</ChakraMenu.ItemGroupLabel>}
      <List
        items={entry.items}
        render={(sub, subIdx) => (
          <ChakraMenu.Item key={sub.id} value={sub.id} asChild>
            {render ? render(sub, subIdx, entry.items) : sub.id}
          </ChakraMenu.Item>
        )}
      />
    </ChakraMenu.ItemGroup>
  );
}
