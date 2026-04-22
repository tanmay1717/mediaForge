'use client';
import React from 'react';

/**
 * TODO: general settings page
 echo " * - Delivery domain configuration + status
 * - Account profile (name, email — read-only from Cognito)
 * - Change password form";;
  api-keys) echo " * - API key table (label, prefix, status, last used, created)
 * - Create new key button → dialog → show raw key ONCE
 * - Revoke key button with confirmation";;
  cache) echo " * - Purge by asset ID input
 * - Purge by folder selector
 * - Purge all button (with big warning)
 * - Show cache stats: total cached variants, estimated size";;
  usage) echo " * - Storage usage chart (line chart over time, recharts)
 * - Bandwidth chart
 * - Transforms generated chart
 * - Assets by type pie/donut chart
 * - Use useStats() hook";;
esac)
 */
export default function generalSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">general</h1>
      <p className="text-gray-500">TODO: Implement general settings</p>
    </div>
  );
}
