"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcileIdentity = void 0;
const Contact_1 = require("../models/Contact");
const reconcileIdentity = async (email, phoneNumber) => {
    const query = [];
    if (email)
        query.push({ email });
    if (phoneNumber)
        query.push({ phoneNumber });
    if (query.length === 0) {
        throw new Error('Email or phoneNumber must be provided');
    }
    const initialMatches = await Contact_1.Contact.find({ $or: query });
    if (initialMatches.length === 0) {
        // 1. No matching contacts -> create a new primary contact
        const newContact = await Contact_1.Contact.create({
            email: email || null,
            phoneNumber: phoneNumber || null,
            linkPrecedence: 'primary',
        });
        return formatResponse([newContact]);
    }
    // 2. Find all related contacts (to cover the whole linked tree)
    const relatedPrimaryIds = new Set();
    initialMatches.forEach((contact) => {
        if (contact.linkPrecedence === 'primary') {
            relatedPrimaryIds.add(contact._id.toString());
        }
        else if (contact.linkedId) {
            relatedPrimaryIds.add(contact.linkedId.toString());
        }
    });
    // Fetch the fully resolved cluster
    const cluster = await Contact_1.Contact.find({
        $or: [
            { _id: { $in: Array.from(relatedPrimaryIds) } },
            { linkedId: { $in: Array.from(relatedPrimaryIds) } },
        ],
    });
    const clusterPrimaries = cluster.filter((c) => c.linkPrecedence === 'primary');
    clusterPrimaries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const ultimatePrimary = clusterPrimaries[0];
    // 3. Consolidate primaries
    for (let i = 1; i < clusterPrimaries.length; i++) {
        const secondaryPrimary = clusterPrimaries[i];
        secondaryPrimary.linkPrecedence = 'secondary';
        secondaryPrimary.linkedId = ultimatePrimary._id;
        await secondaryPrimary.save();
    }
    // Ensure all existing secondaries point to the ultimate primary
    const clusterSecondaries = cluster.filter((c) => c.linkPrecedence === 'secondary');
    for (const secondary of clusterSecondaries) {
        if (secondary.linkedId?.toString() !== ultimatePrimary._id.toString()) {
            secondary.linkedId = ultimatePrimary._id;
            await secondary.save();
        }
    }
    // 4. Check if we need to create a new secondary contact for new info
    const isNewEmail = email && !cluster.some((c) => c.email === email);
    const isNewPhone = phoneNumber && !cluster.some((c) => c.phoneNumber === phoneNumber);
    if (isNewEmail || isNewPhone) {
        const newSecondary = await Contact_1.Contact.create({
            email: email || null,
            phoneNumber: phoneNumber || null,
            linkedId: ultimatePrimary._id,
            linkPrecedence: 'secondary',
        });
        cluster.push(newSecondary);
    }
    // Prepare final data for response format
    // Re-fetch to ensure clean state after saves, or just use memory objects
    const finalCluster = await Contact_1.Contact.find({
        $or: [
            { _id: ultimatePrimary._id },
            { linkedId: ultimatePrimary._id }
        ]
    });
    // order final cluster so ultimate primary is first
    finalCluster.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return formatResponse(finalCluster);
};
exports.reconcileIdentity = reconcileIdentity;
const formatResponse = (contacts) => {
    const primaryContact = contacts.find((c) => c.linkPrecedence === 'primary') || contacts[0];
    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = [];
    // Primary first
    if (primaryContact.email)
        emails.add(primaryContact.email);
    if (primaryContact.phoneNumber)
        phoneNumbers.add(primaryContact.phoneNumber);
    // Secondaries
    contacts.forEach((c) => {
        if (c._id.toString() !== primaryContact._id.toString()) {
            secondaryContactIds.push(c._id.toString());
            if (c.email)
                emails.add(c.email);
            if (c.phoneNumber)
                phoneNumbers.add(c.phoneNumber);
        }
    });
    return {
        contact: {
            primaryContactId: primaryContact._id.toString(),
            emails: Array.from(emails),
            phoneNumbers: Array.from(phoneNumbers),
            secondaryContactIds,
        },
    };
};
