function createProcessTable() {
    // Get the number of processes from the user input
    const numProcesses = document.getElementById('num_processes').value;
    
    // Create the table element
    const table = document.createElement('table');
    table.setAttribute('id', 'process_table');
  
    // Create the table header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Process</th><th>Burst Time</th>';
    table.appendChild(headerRow);
  
    // Create rows for process input
    for (let i = 0; i < numProcesses; i++) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>P${i}</td>
        <td><input type="number" id="burst_time_${i}" min="1"></td>
      `;
      table.appendChild(row);
    }
  
    // Add the table to the process_table div
    const processTableDiv = document.getElementById('process_table');
    processTableDiv.innerHTML = ''; // Clear existing table content
    processTableDiv.appendChild(table);
  }
  
  function calculateFCFS() {
    // Get the number of processes from the user input
    const numProcesses = document.getElementById('num_processes').value;
   
  
    // Get burst times from the table
    const burstTimes = [];
    for (let i = 0; i < numProcesses; i++) {
      const burstTimeInput = document.getElementById(`burst_time_${i}`);
      const burstTime = burstTimeInput.value ? parseInt(burstTimeInput.value) : 1;
      burstTimes.push(burstTime);
    }
  
    // Validate input (all burst times must be positive)
    let allPositive = true;
    for (const burstTime of burstTimes) {
      if (burstTime <= 0) {
        allPositive = false;
        break;
      }
    }
  
    if (!allPositive) {
      document.getElementById('result').innerHTML = 'Error: All burst times must be positive.';
      return;
    }
  
    // Since arrival times are not considered, assume they are all 0
    const processData = [];
  for (let i = 0; i < numProcesses; i++) {
    processData.push({
      process: `P${i}`,
      burstTime: burstTimes[i],
    });
  }

  // Calculate completion times (simple addition of burst times)
  let currentTime = 0;
  const completionTimes = [];
  for (const process of processData) {
    completionTimes.push(currentTime + process.burstTime);
    currentTime = completionTimes[completionTimes.length - 1];
  }

  // Calculate turnaround time and waiting time
  for (const process of processData) {
    const waitingTime = completionTimes[processData.indexOf(process)] - process.burstTime;
    process.waitingTime = waitingTime;
  }

  // Calculate average waiting time
  let totalWaitingTime = 0;
  for (const process of processData) {
    totalWaitingTime += process.waitingTime;
  }
  const averageWaitingTime = totalWaitingTime / numProcesses;

  // Create the results table element
  const resultTable = document.createElement('table');
  resultTable.setAttribute('id', 'result_table');

  // Create the table header row
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>Process</th><th>Burst Time</th><th>Completion Time</th><th>Waiting Time</th>';
  resultTable.appendChild(headerRow);

  // Create rows for results (using DOM methods)
  for (const process of processData) {
    const row = document.createElement('tr');

    // Create cells for each data item
    const processCell = document.createElement('td');
    processCell.textContent = process.process;
    row.appendChild(processCell);

    const burstTimeCell = document.createElement('td');
    burstTimeCell.textContent = process.burstTime;
    row.appendChild(burstTimeCell);

    const completionTimeCell = document.createElement('td');
    completionTimeCell.textContent = completionTimes[processData.indexOf(process)];
    row.appendChild(completionTimeCell);

    const waitingTimeCell = document.createElement('td');
    waitingTimeCell.textContent = process.waitingTime;
    row.appendChild(waitingTimeCell);

    row.appendChild(waitingTimeCell);

    // Append the row to the table
    resultTable.appendChild(row);
  }

  // Add a row for average waiting time
  const averageRow = document.createElement('tr');
  averageRow.innerHTML = `
    <td colspan="3">Average Waiting Time:</td>
    <td>${averageWaitingTime.toFixed(2)}%</td>
  `;
  resultTable.appendChild(averageRow);

  // Display results by adding the table to the result div
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // Clear existing content
  resultDiv.appendChild(resultTable);
}