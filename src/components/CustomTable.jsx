import React, { useState, useEffect } from 'react'
// import { RxDotsHorizontal } from "react-icons/rx";
import {
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
  } from '@chakra-ui/react';
import CustomInput from './CustomInput';

const CustomTable = ({ columns, data, onRowSelect }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    const handleRowSelect = (row) => {
        const isSelected = selectedRows.includes(row);
        setSelectedRows((prevSelected) =>
        isSelected
            ? prevSelected.filter((selectedRow) => selectedRow !== row)
            : [...prevSelected, row]
        );

        // Pass selected rows to parent component
        onRowSelect && onRowSelect(selectedRows);
    };

    // const handleRowAction = (row) => {
    //     // Pass the selected row to the parent component for action
    //     onRowAction && onRowAction(row);
    // };




    useEffect(() => {
        // Filter data based on the search term
        const filtered = data.filter((row) =>
            Object.values(row).some(
            (cell) =>
                typeof cell === 'string' && cell.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [data, searchTerm]);






  return (
    <div className='w-full flex flex-col gap-2 py-5 px-3 items-center justify-center'>
        <CustomInput type='text' label='Search' placeholder='Search' value={searchTerm} onChange={(value) => setSearchTerm(value)} className='text-blue-600' />

        <TableContainer className='w-full border border-neutral-300 rounded-lg'>
            <Table size="md" variant='simple' colorScheme='blackAlpha table-auto' className='w-fit'>
                <Thead >
                <Tr className='bg-neutral-400 text-white'>
                    {columns.map((column) => (
                    <Th key={column} color='white font-semibold'>{column}</Th>
                    ))}
                </Tr>
                </Thead>
                <Tbody>
                {filteredData.map((row, rowIndex) => (
                    <Tr
                    key={rowIndex}
                    onClick={() => handleRowSelect(row)}
                    cursor="pointer"
                    fontWeight='medium'
                    _hover={{ bg: 'white', color: 'blue.500' }}
                    rounded='md'
                    fontSize={['sm', 'md']}
                    >
                        
                    {Object.values(row).map((cell, cellIndex) => (
                        <Td key={cellIndex}>{cell}</Td>
                    ))}
                    {/* <Td>
                        <button onClick={() => handleRowAction(row)} className='p-1 bg-neutral-400 rounded-md hover:bg-neutral-500 hover:text-white'><RxDotsHorizontal /></button>
                    </Td> */}
                    </Tr>
                ))}
                </Tbody>
                <Tfoot>
                
                </Tfoot>
            </Table>
        </TableContainer>
    </div>
    
  )
}

export default CustomTable