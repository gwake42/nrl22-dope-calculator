// DopeCardPrint component for generating printable 2" x 3.5" dope cards
export function generateAndPrintDopeCard(stage, userSettings) {
    if (!stage.shotSequence || stage.shotSequence.length === 0) {
        alert('No shot sequence to print. Add shots to this stage first.');
        return;
    }

    // Generate the HTML for a single dope card
    const cardHTML = generateMultiCardHTML([stage], userSettings);
    
    // Open a new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(cardHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
        printWindow.print();
        // Don't close the window automatically - let user close it
    };
}

// Function to print multiple stages on one sheet
export function generateAndPrintMultipleCards(stages, userSettings) {
    const stagesWithSequences = stages.filter(stage => 
        stage.shotSequence && stage.shotSequence.length > 0
    );
    
    if (stagesWithSequences.length === 0) {
        alert('No stages with shot sequences to print.');
        return;
    }

    // Generate the HTML for multiple cards
    const cardHTML = generateMultiCardHTML(stagesWithSequences, userSettings);
    
    // Open a new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(cardHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
        printWindow.print();
        // Don't close the window automatically - let user close it
    };
}

function generateMultiCardHTML(stages, userSettings) {
    const cardsHTML = stages.map(stage => generateSingleCardHTML(stage, userSettings)).join('');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>NRL22 Dope Cards</title>
    <style>
        @page {
            size: letter;
            margin: 0.25in;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                color: #000;
                background: white;
                line-height: 1.1;
            }
            
            .cards-container {
                display: grid;
                grid-template-columns: repeat(4, 2in);
                grid-template-rows: repeat(5, 3.5in);
                gap: 0.1in;
                width: 8.5in;
                height: 10.5in;
                padding: 0;
                margin: 0 auto;
            }
            
            .dope-card {
                width: 2in;
                height: 3.5in;
                border: 1px solid #000;
                display: flex;
                flex-direction: column;
                background: white;
                overflow: hidden;
                page-break-inside: avoid;
                box-sizing: border-box;
            }
            
            .header {
                border-bottom: 1px solid #000;
                padding: 1px 2px;
                background: #f8f8f8;
            }
            
            .stage-name {
                font-weight: bold;
                font-size: 8px;
                margin-bottom: 0.5px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .conditions {
                font-size: 5.5px;
                text-align: center;
                margin-bottom: 0.5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 1;
            }
            
            .zero-info {
                font-size: 5.5px;
                text-align: center;
                color: #666;
                line-height: 1;
            }
            
            .shot-table {
                width: 100%;
                border-collapse: collapse;
                flex-grow: 1;
                height: 100%;
            }
            
            .shot-table th {
                border-bottom: 1px solid #000;
                padding: 1px;
                font-weight: bold;
                font-size: 7px;
                text-align: center;
                background: #f0f0f0;
                height: 12px;
            }
            
            .shot-table td {
                padding: 1px;
                text-align: center;
                font-size: 7px;
                border-bottom: 0.5px solid #ddd;
                height: 12px;
                vertical-align: middle;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .shot-number {
                width: 35%;
                font-weight: bold;
                font-size: 6px;
                text-align: left;
                padding-left: 2px;
            }
            
            .holdover {
                width: 32%;
                font-weight: bold;
                font-size: 8px;
            }
            
            .clicks {
                width: 33%;
                font-weight: bold;
                font-size: 8px;
            }
            
            .hold-up {
                color: #0066cc;
            }
            
            .hold-down {
                color: #cc6600;
            }
            
            .footer {
                padding: 0.5px 1px;
                border-top: 0.5px solid #ccc;
                font-size: 4.5px;
                text-align: center;
                color: #666;
                background: #f8f8f8;
                line-height: 1;
            }
        }
        
        /* For screen preview */
        @media screen {
            body {
                margin: 20px;
                background: #f0f0f0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            }
            
            .cards-container {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                max-width: 1000px;
                margin: 0 auto;
            }
            
            .dope-card {
                width: 2in;
                height: 3.5in;
                background: white;
                border: 1px solid #ccc;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .header {
                border-bottom: 1px solid #000;
                padding: 4px;
                background: #f8f8f8;
            }
            
            .stage-name {
                font-weight: bold;
                font-size: 10px;
                margin-bottom: 2px;
                text-align: center;
            }
            
            .conditions {
                font-size: 7px;
                text-align: center;
                margin-bottom: 1px;
            }
            
            .zero-info {
                font-size: 7px;
                text-align: center;
                color: #666;
            }
            
            .shot-table {
                width: 100%;
                border-collapse: collapse;
                flex-grow: 1;
            }
            
            .shot-table th {
                border-bottom: 1px solid #000;
                padding: 2px;
                font-weight: bold;
                font-size: 8px;
                text-align: center;
                background: #f0f0f0;
            }
            
            .shot-table td {
                padding: 2px;
                text-align: center;
                font-size: 8px;
                border-bottom: 0.5px solid #ddd;
            }
            
            .footer {
                padding: 2px;
                border-top: 0.5px solid #ccc;
                font-size: 6px;
                text-align: center;
                color: #666;
                background: #f8f8f8;
            }
        }
    </style>
</head>
<body>
    <div class="cards-container">
        ${cardsHTML}
    </div>
</body>
</html>`;
}

function generateSingleCardHTML(stage, userSettings) {
    // Create dope data for each shot in the sequence
    const shotDopeData = stage.shotSequence.map((shot, index) => {
        // Find the dope data for this distance
        const dopeEntry = stage.dopeData.find(d => d.distance === shot.distance);
        if (!dopeEntry) return null;

        const milValue = parseFloat(dopeEntry.milAdjustment);
        const isUnderZero = shot.distance < userSettings.zeroDistance;
        
        return {
            shotDescription: shot.targetName || `Shot ${index + 1}`,
            distance: shot.distance,
            holdover: isUnderZero ? 
                `${Math.abs(milValue).toFixed(1)}↓` : 
                `${milValue}↑`,
            clicks: isUnderZero ? '—' : `${dopeEntry.clicksTenth}↑`
        };
    }).filter(Boolean); // Remove any null entries

    return `
        <div class="dope-card">
            <div class="header">
                <div class="stage-name">${stage.name}</div>
                <div class="conditions">${stage.ammo.name} @ ${stage.ammo.velocity}fps</div>
                <div class="conditions">${stage.weather.temp}°F • ${stage.weather.pressure}"Hg</div>
                <div class="zero-info">Zero: ${userSettings.zeroDistance}y</div>
            </div>
            
            <table class="shot-table">
                <thead>
                    <tr>
                        <th class="shot-number">Shot</th>
                        <th class="holdover">Hold</th>
                        <th class="clicks">Clicks</th>
                    </tr>
                </thead>
                <tbody>
                    ${shotDopeData.map(shot => `
                        <tr>
                            <td class="shot-number" title="${shot.distance}y">${shot.shotDescription}</td>
                            <td class="holdover ${shot.holdover.includes('↓') ? 'hold-down' : 'hold-up'}">${shot.holdover}</td>
                            <td class="clicks ${shot.clicks === '—' ? 'hold-down' : 'hold-up'}">${shot.clicks}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                ↑ UP • ↓ LOW • — Stop
            </div>
        </div>`;
}