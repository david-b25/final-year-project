"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import LoadingSpinner from "./loading-spinner";
import { statusCustomDomain, verifyStatusCustomDomain } from '@/lib/actions/domains';
import { useState, useEffect } from "react";

export default function DomainStatus({ domain_uuid }: { domain_uuid : string }) {
    const [loading, setLoading] = useState(false);
    const [domainStatus, setDomainStatus] = useState('');

    console.log("Domain UUID: " + domain_uuid);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                await verifyStatusCustomDomain(domain_uuid);
                console.log("Check Ran");
                const result = await statusCustomDomain(domain_uuid);
                setDomainStatus(result.status);
                console.log(result.status);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
  }, [domain_uuid]); 

    return loading ? (
        <LoadingSpinner />
    ) : domainStatus === 'dns_records_found' ? (
        <div className="flex items-center">
            <CheckCircle2
            fill="#03BA00"
            stroke="currentColor"
            className="text-white ml-1 dark:text-black"
            />
            <p className="text-sm text-stone-500 ml-1">Successful Connection</p>
        </div>
    ) : domainStatus === 'pending_check' ? (
        <div className="flex items-center">
            <AlertCircle
            fill="#FBBF24"
            stroke="currentColor"
            className="text-white ml-1 dark:text-black"
            />
             <p className="text-sm text-stone-500 ml-1">Pending Verification</p>
        </div>
    ) : (
        <div className="flex items-center">
            <XCircle
            fill="#DC2626"
            stroke="currentColor"
            className="text-white ml-1 dark:text-black"
            />
            <p className="text-sm text-stone-500 ml-1">Error</p>
        </div>
    );
}