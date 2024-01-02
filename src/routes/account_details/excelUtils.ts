import * as XLSX from "xlsx";

type transaction = {
    date: string | undefined;
    amount: number | undefined;
    balance: number | undefined;
    type: string | undefined;
};

export async function extractDataFromExcel(file: string){
    let transactions: transaction[] = [];
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { range: "A16:I98" }); // specify the range here
    transactions = data.map((d: any) => {
      let type, amount;
      if (d.Withdrawals) {
        type = "withdrawal";
        amount = +d.Withdrawals;
      } else if (d.Deposits) {
        type = "deposit";
        amount = +d.Deposits;
      }
      return {
        date: d.Date,
        amount: amount,
        balance: +d.Balance,
        type: type,
      };
    });
    transactions = transactions.filter((transaction: transaction) => {
      return (
        transaction.date !== undefined &&
        transaction.amount !== undefined &&
        !isNaN(transaction.amount) &&
        transaction.balance !== undefined &&
        !isNaN(transaction.balance) &&
        transaction.type !== undefined
      );
    });
    return transactions;
}