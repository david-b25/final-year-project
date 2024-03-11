"use client";

import { useState, useEffect } from "react";
import { AlertCircle, XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusCustomDomain } from '@/lib/actions';

export const InlineSnippet = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  return (
    <span
      className={cn(
        "inline-block rounded-md bg-blue-100 px-1 py-0.5 font-mono text-blue-900 dark:bg-blue-900 dark:text-blue-100",
        className,
      )}
    >
      {children}
    </span>
  );
};

export default function DomainConfiguration({ domain_uuid }: { domain_uuid: string }) {
  const [recordType, setRecordType] = useState<"A" | "CNAME">("A");
  const [domainStatus, setDomainStatus] = useState('');
  const [loading, setLoading] = useState(false);

  console.log("Domain UUID from config file: " + domain_uuid);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const result = await statusCustomDomain(domain_uuid);
        setDomainStatus(result.status);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [domain_uuid]); 

  if (!domainStatus){
    console.log("No Domain Status");
    return null;
  }

  
  return (
    <div className="border-t border-stone-200 px-10 pb-5 pt-7 dark:border-stone-700">
      <div className="mb-4 flex items-center space-x-2">
          {
            domainStatus === "pending_check" ? (
              <div className="flex flex-row items-center justify-start gap-2">
                <p className="text-lg font-semibold"> Pending Check </p>
                <AlertCircle
                    fill="#FBBF24"
                    stroke="currentColor"
                    className="text-white dark:text-black"
                />
              </div>
            ) : domainStatus === 'dns_records_found' ? (
              <div className="flex flex-row items-center justify-start gap-2">
                <p className="text-lg font-semibold"> Connection Found </p>
                <CheckCircle2
                    fill="#03BA00"
                    stroke="currentColor"
                    className="text-white dark:text-black"
                />
              </div>
            ) : (
              <div className="flex flex-row items-center justify-start gap-2">
              <p className="text-lg font-semibold"> An Error Occured </p>
              <XCircle
                fill="#DC2626"
                stroke="currentColor"
                className="text-white ml-1 dark:text-black"
              />
            </div>
          )
        }
        </div>
    </div>
  );
}