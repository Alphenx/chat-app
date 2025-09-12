import ActionsDisplayer, { Action } from '@/components/ActionsDisplayer/ActionsDisplayer';
import Avatar from '@/components/Avatar/Avatar';
import { HStack, Stack, Text } from '@chakra-ui/react';

interface UserListItemProps {
  user: PublicUser;
  actions?: Action<PublicUser>[];
}

function UserListItem({ user, actions }: UserListItemProps) {
  const enhancedActions = actions?.map((action) => ({
    ...action,
    onClick: () => action.onClick?.(user),
    onMouseEnter: () => action.onMouseEnter?.(user),
  }));

  return (
    <HStack gap='4' py='2.5'>
      <Avatar size={{ base: 'xl', smDown: 'lg' }} src={user.image} />

      <HStack flexGrow={1} minW={0} justifyContent='space-between' alignItems='center' gap='5'>
        <Stack flexGrow={1} minW={0} gap='0.5'>
          <Text fontWeight='bold' overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>
            {user.name}
          </Text>
          <Text fontSize='sm' overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>
            {user.email}
          </Text>
        </Stack>

        <ActionsDisplayer actions={enhancedActions} />
      </HStack>
    </HStack>
  );
}

export default UserListItem;
