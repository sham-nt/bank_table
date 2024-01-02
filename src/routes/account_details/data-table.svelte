<script lang="ts">
  import { onMount } from "svelte";
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import { readable, writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import { extractDataFromExcel } from "./excelUtils";

  type transaction = {
    date: string | undefined;
    amount: number | undefined;
    balance: number | undefined;
    type: string | undefined;
  };

  // Use a Svelte store to hold your transactions
  const transactionsStore = writable<transaction[]>([])
  
  onMount(async () => {
    const data = await extractDataFromExcel("/bank_statement.xlsx");
    transactionsStore.set(data);
  });

    const table = createTable(transactionsStore);
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
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
      table.createViewModel(columns);
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
