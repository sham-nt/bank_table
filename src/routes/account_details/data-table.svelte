<script lang="ts">
  import { onMount } from "svelte";
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import { extractDataFromExcel } from './excelUtils';

  type transaction = {
    date: string | undefined;
    amount: number | undefined;
    balance: number | undefined;
    type: string | undefined;
  };

  let foo : transaction[] = [];
  onMount(async () => {
    foo = await extractDataFromExcel("/bank_statement.xlsx");
    console.log(foo);
  });

  let transactions: transaction[] = [
  {
    date: "2021-01-01",
    amount: 100,
    balance: 100,
    type: "Deposit",
  },
  {
    date: "2021-01-02",
    amount: 100,
    balance: 200,
    type: "Deposit",
  },
  {
    date: "2021-01-03",
    amount: 100,
    balance: 300,
    type: "Deposit",
  },
  {
    date: "2021-01-04",
    amount: 100,
    balance: 400,
    type: "Deposit",
  },
  {
    date: "2021-01-05",
    amount: 100,
    balance: 500,
    type: "Deposit",
  },
  {
    date: "2021-01-06",
    amount: 100,
    balance: 600,
    type: "Deposit",
  },
  {
    date: "2021-01-07",
    amount: 100,
    balance: 700,
    type: "Deposit",
  },
  {
    date: "2021-01-08",
    amount: 100,
    balance: 800,
    type: "Deposit",
  },
  {
    date: "2021-01-09",
    amount: 100,
    balance: 900,
    type: "Deposit",
  },
  {
    date: "2021-01-10",
    amount: 100,
    balance: 1000,
    type: "Deposit",
  },
  {
    date: "2021-01-11",
    amount: 100,
    balance: 1100,
    type: "Deposit",
  },
  {
    date: "2021-01-12",
    amount: 100,
    balance: 1200,
    type: "Deposit",
  },
  {
    date: "2021-01-13",
    amount: 100,
    balance: 1300,
    type: "Deposit",
  },
  {
    date: "2021-01-14",
    amount: 100,
    balance: 1400,
    type: "Deposit",
  },
  {
    date: "2021-01-15",
    amount: 100,
    balance: 1500,
    type: "Deposit",
  }
  ];
  const table = createTable(readable(transactions));
    const columns = table.createColumns([
      table.column({
        accessor: "date",
        header: "Date",
      }),
      table.column({
        accessor: "type",
        header: "Type",
      }),
      table.column({
        accessor: "amount",
        header: "Amount",
      }),
      table.column({
        accessor: "balance",
        header: "Balance",
      }),
    ]);
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                <Table.Head {...attrs}>
                  <Render of={cell.render()} />
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  <Render of={cell.render()} />
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
