/**
 * CUSTOM: gptchina fork
 *
 * Feature: Terms of Service
 * File: Main page component
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Comprehensive terms of service page outlining user agreements, responsibilities,
 * and legal terms for using GPT China platform.
 * Full i18n support with clear, readable language.
 */

import React from 'react';
import { useLocalize } from '~/hooks';

export default function TermsOfServicePage() {
  const localize = useLocalize();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-surface-primary text-text-primary">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">
              {(localize as any)('com_custom_terms_title')}
            </h1>
            <p className="text-base text-text-secondary">
              {(localize as any)('com_custom_terms_last_updated')}
            </p>
          </div>

          {/* Introduction & Acceptance */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_acceptance_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_acceptance_intro')}
            </p>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_acceptance_binding')}
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_acceptance_age')}
            </p>
          </section>

          {/* Account Registration */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_account_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_account_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>
                <strong>{(localize as any)('com_custom_terms_account_accurate_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_account_accurate_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_terms_account_security_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_account_security_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_terms_account_notify_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_account_notify_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_terms_account_responsible_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_account_responsible_desc')}
              </li>
            </ul>
          </section>

          {/* Token System & Payments */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_tokens_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_tokens_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>
                <strong>{(localize as any)('com_custom_terms_tokens_purchase_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_tokens_purchase_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_terms_tokens_usage_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_tokens_usage_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_terms_tokens_pricing_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_tokens_pricing_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_terms_tokens_claim_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_tokens_claim_desc')}
              </li>
            </ul>
            <div className="mt-6 rounded-lg border-l-4 border-l-red-500 bg-surface-tertiary px-5 py-4">
              <p className="text-sm text-text-secondary">
                <strong className="font-semibold">
                  {(localize as any)('com_custom_terms_tokens_nonrefundable_label')}
                </strong>{' '}
                {(localize as any)('com_custom_terms_tokens_nonrefundable_content')}
              </p>
            </div>
          </section>

          {/* Acceptable Use Policy */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_acceptable_use_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_acceptable_use_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_terms_prohibited_illegal')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_harmful')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_abuse')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_spam')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_impersonate')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_scraping')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_malware')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_bypass')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_reverse')}</li>
              <li>{(localize as any)('com_custom_terms_prohibited_resell')}</li>
            </ul>
          </section>

          {/* User Content & Intellectual Property */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_content_title')}
            </h2>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_terms_content_ownership_title')}
            </h3>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_content_ownership_desc')}
            </p>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_terms_content_license_title')}
            </h3>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_content_license_desc')}
            </p>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_terms_content_platform_title')}
            </h3>
            <p className="text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_content_platform_desc')}
            </p>
          </section>

          {/* Service Availability */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_availability_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_availability_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_terms_availability_uptime')}</li>
              <li>{(localize as any)('com_custom_terms_availability_maintenance')}</li>
              <li>{(localize as any)('com_custom_terms_availability_modifications')}</li>
              <li>{(localize as any)('com_custom_terms_availability_third_party')}</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_third_party_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_third_party_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_terms_third_party_ai')}</li>
              <li>{(localize as any)('com_custom_terms_third_party_payment')}</li>
              <li>{(localize as any)('com_custom_terms_third_party_links')}</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_disclaimer_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_disclaimer_intro')}
            </p>
            <div className="rounded-lg bg-surface-tertiary p-6">
              <p className="mb-4 text-sm uppercase tracking-wide text-text-secondary">
                {(localize as any)('com_custom_terms_disclaimer_as_is')}
              </p>
              <p className="mb-4 text-base text-text-secondary">
                {(localize as any)('com_custom_terms_disclaimer_no_warranties')}
              </p>
              <p className="text-base text-text-secondary">
                {(localize as any)('com_custom_terms_disclaimer_ai_output')}
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_liability_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_liability_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_terms_liability_indirect')}</li>
              <li>{(localize as any)('com_custom_terms_liability_data_loss')}</li>
              <li>{(localize as any)('com_custom_terms_liability_interruption')}</li>
              <li>{(localize as any)('com_custom_terms_liability_cap')}</li>
            </ul>
          </section>

          {/* Termination & Suspension */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_termination_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_termination_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>
                <strong>{(localize as any)('com_custom_terms_termination_by_user_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_termination_by_user_desc')}
              </li>
              <li>
                <strong>
                  {(localize as any)('com_custom_terms_termination_by_platform_title')}
                </strong>{' '}
                – {(localize as any)('com_custom_terms_termination_by_platform_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_terms_termination_effect_title')}</strong> –{' '}
                {(localize as any)('com_custom_terms_termination_effect_desc')}
              </li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_dispute_title')}
            </h2>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_terms_dispute_law_title')}
            </h3>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_dispute_law_desc')}
            </p>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_terms_dispute_resolution_title')}
            </h3>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_dispute_resolution_desc')}
            </p>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_terms_dispute_jurisdiction_title')}
            </h3>
            <p className="text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_dispute_jurisdiction_desc')}
            </p>
          </section>

          {/* Changes to Terms & Contact */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_changes_title')}
            </h2>
            <p className="mb-8 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_changes_desc')}
            </p>

            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_terms_contact_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_terms_contact_desc')}
            </p>
            <div className="rounded-lg bg-surface-tertiary p-6">
              <p className="mb-2 text-base">
                <strong>{(localize as any)('com_custom_terms_contact_email_label')}</strong>{' '}
                <a href="mailto:support@gptchina.io" className="text-blue-500 hover:underline">
                  support@gptchina.io
                </a>
              </p>
              <p className="text-base">
                <strong>{(localize as any)('com_custom_terms_contact_website_label')}</strong>{' '}
                <a
                  href="https://gptchina.io"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://gptchina.io
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
