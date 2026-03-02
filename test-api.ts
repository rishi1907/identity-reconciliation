async function runTest(name: string, payload: any) {
    console.log(`\n\n--- Running Test: ${name} ---`);
    console.log("Payload:", payload);
    try {
        const response = await fetch("https://identity-reconciliation-2-ubj6.onrender.com/identify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

async function runAllTests() {
    await runTest("Test 1: Create a brand new Primary Contact", {
        email: "test_script_lorraine@hillvalley.edu",
        phoneNumber: "test_script_12345"
    });

    await runTest("Test 2: Match an existing Primary and add new information (Linked Secondary)", {
        email: "test_script_mcfly@hillvalley.edu",
        phoneNumber: "test_script_12345"
    });

    await runTest("Test 3: Find exact matches (No new information)", {
        email: "test_script_lorraine@hillvalley.edu",
        phoneNumber: "test_script_12345"
    });

    await runTest("Test 4a: Create Independent Primary", {
        email: "test_script_doc@brown.com",
        phoneNumber: "test_script_99999"
    });

    await runTest("Test 4b: Trigger Consolidation", {
        email: "test_script_doc@brown.com",
        phoneNumber: "test_script_12345"
    });
}

runAllTests();
