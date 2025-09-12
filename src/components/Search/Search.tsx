'use client';

import Field from '@/components/Field/Field';
import IconButton from '@/components/IconButton/IconButton';
import InputGroup from '@/components/InputGroup/InputGroup';
import List from '@/components/List/List';
import Popover from '@/components/Popover/Popover';
import { useDebounce } from '@/features/common/hooks';
import { extractText } from '@/features/common/utils/string/extract-text-from-node';
import { Flex, Icon, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { MdErrorOutline } from 'react-icons/md';

interface SearchProps<T extends { id: string }> {
  label?: ReactNode;
  showLabel?: boolean;
  placeholder?: ReactNode;
  noResultsLabel?: ReactNode;
  clearLabel?: ReactNode;
  items: T[];
  filterFn: (item: T, query: string) => boolean;
  render: (item: T, index: number, items: T[]) => ReactNode;
  onSearch?: (filteredItems: T[], query: string) => void;
  error: string | null;
  isLoading?: boolean;
  isDropdown?: boolean;
}

function Search<T extends { id: string }>({
  label = 'Search',
  placeholder = 'Search...',
  noResultsLabel = 'No results found',
  clearLabel = 'Clear',
  items,
  filterFn,
  render,
  onSearch,
  error,
  isLoading = false,
  showLabel = false,
  isDropdown = false,
}: SearchProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleClear = useCallback(() => setQuery(''), []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => filterFn(item, debouncedQuery));
  }, [items, debouncedQuery, filterFn]);

  useEffect(() => onSearch?.(filteredItems, debouncedQuery), [filteredItems, debouncedQuery, onSearch]);

  const renderSearchField = () => (
    <Field label={showLabel && label}>
      <InputGroup
        width='100%'
        startElement={<SearchIcon />}
        endElement={<ClearButton query={query} label={clearLabel} handleClear={handleClear} />}
      >
        <Input placeholder={extractText(placeholder)} value={query} onChange={handleChange} />
      </InputGroup>
    </Field>
  );

  const renderContent = () => {
    if (isLoading) return <Loading />;
    if (error) return <NoResults label={error} />;
    if (debouncedQuery && filteredItems.length === 0) return <NoResults label={noResultsLabel} />;
    return <List items={filteredItems} render={render} />;
  };

  if (isDropdown) {
    return <Popover trigger={renderSearchField()}>{renderContent()}</Popover>;
  }

  return (
    <Stack flexGrow='1'>
      {renderSearchField()}
      {renderContent()}
    </Stack>
  );
}

export default Search;

function Loading() {
  return (
    <Flex justifyContent='center' m={4}>
      <Spinner />
    </Flex>
  );
}

function NoResults({ label }: { label: ReactNode }) {
  return (
    <Flex justifyContent='center' alignItems='center' m={4}>
      <Icon size='md' mr='1' color='fg.error'>
        <MdErrorOutline />
      </Icon>
      <Text color='fg.error' fontSize='lg'>
        {label}
      </Text>
    </Flex>
  );
}

function SearchIcon() {
  return (
    <Icon pointerEvents='none' size='sm' mt='-0.25'>
      <FiSearch color='gray' />
    </Icon>
  );
}

type ClearButtonProps = {
  query: string;
  label: ReactNode;
  handleClear: () => void;
};

function ClearButton({ query, label, handleClear }: ClearButtonProps) {
  if (!query) return null;

  return <IconButton minWidth='100%' size='sm' label={label} icon={<FiX />} onClick={handleClear} variant='plain' />;
}
