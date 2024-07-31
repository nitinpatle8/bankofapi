import React, {useState, useEffect} from 'react';
import axios from 'axios';

let uri = 'http://localhost:3080/data?accountId?450000_10000000';

const categories = ['Travel', 'Clothing', 'Gas & Electricity'];
const carbonFootPrintMapping = {
        'Travel': 0.9,
        'Clothing': 0.4, 
        'Gas & Electricity': 1
}

const categoryMatch = (categoryObj) => {
    var retVal = "Others";
    if(categoryObj === undefined) return retVal;
    categories.forEach(category => Object.keys(categoryObj).forEach(key => {
        if(category === categoryObj[key]){
            retVal = category;
        }
    }
    ));
    return retVal;
}

const sumTransactionsByCategory = (transactions) => {
    return transactions.reduce((acc, transaction) => {
        const category = categoryMatch(transaction.category);
        console.log(category)
        const amount = -(transaction.amount);
        if(!acc[category]) {
            acc[category] = {sum : 0, carbon : 0};
        }
        acc[category].sum += amount;
        acc[category].carbon += amount * carbonFootPrintMapping[category];
        return acc;
    }, {});
}



const UsersTable = () => {
    const [transactions, setTransactions] = useState([]);
    
    const [acc, setAcc] = useState([]);

    useEffect(() => {
        axios.get(uri)
        .then(response => {
            setTransactions(response.data);
            setAcc(sumTransactionsByCategory(response.data));
        })
        .catch(error => {
            console.error("There was error", error);
        });
    }, []);

    return (
        <div>
            <h1>User Details</h1>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Carbon Footprint</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(acc).map(([category, {sum, carbon}]) => (
                        <tr key={category}>
                            {console.log(category, sum)}
                            <td>{category}</td>
                            <td>{sum.toFixed(2)}</td>
                            <td>{carbon.toFixed(2)}</td>
                        </tr>    
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersTable;