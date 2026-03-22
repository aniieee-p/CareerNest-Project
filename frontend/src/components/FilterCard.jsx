import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { MapPin, Briefcase, IndianRupee, X } from 'lucide-react'
import { Button } from './ui/button'

const filterData = [
    {
        filterType: "Location",
        icon: MapPin,
        color: "text-[#27bbd2]",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        icon: Briefcase,
        color: "text-[#6366f1]",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        icon: IndianRupee,
        color: "text-[#f59e0b]",
        array: ["0-40k", "42k-1L", "1L-5L"]
    },
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => setSelectedValue(value);
    const clearFilter = () => setSelectedValue('');

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
        <div className='w-full bg-white p-4 rounded-xl border shadow-sm' style={{ borderColor: "rgba(99,102,241,0.15)", boxShadow: "0 2px 16px rgba(39,187,210,0.07)" }}>
            <div className='flex items-center justify-between mb-3'>
                <h1 className='font-bold text-base text-gray-800'>Filter Jobs</h1>
                {selectedValue && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilter}
                        className="text-xs text-gray-400 hover:text-red-500 h-7 px-2 gap-1"
                    >
                        <X size={12} /> Clear
                    </Button>
                )}
            </div>
            <hr className='mb-4' style={{ borderColor: "rgba(99,102,241,0.1)" }} />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => {
                    const Icon = data.icon;
                    return (
                        <div key={index} className='mb-5'>
                            <h2 className={`font-semibold text-sm flex items-center gap-2 mb-2 ${data.color}`}>
                                <Icon size={14} />
                                {data.filterType}
                            </h2>
                            {data.array.map((item, idx) => {
                                const itemId = `filter-${index}-${idx}`;
                                return (
                                    <div key={idx} className='flex items-center space-x-2 my-2 group'>
                                        <RadioGroupItem value={item} id={itemId} />
                                        <Label
                                            htmlFor={itemId}
                                            className='text-sm text-gray-500 cursor-pointer group-hover:text-[#27bbd2] transition-colors'
                                        >
                                            {item}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    );
};

export default FilterCard;
