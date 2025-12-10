/**
 * CUSTOM: gptchina fork
 *
 * Feature: Privacy Policy
 * File: Main page component
 * Created: 2025-12-10
 * Upstream Impact: None (standalone module)
 *
 * Comprehensive privacy policy page explaining data collection, usage, and user rights.
 * Full i18n support with clear, readable language.
 */

import React from 'react';
import { useLocalize } from '~/hooks';

export default function PrivacyPolicyPage() {
  const localize = useLocalize();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-surface-primary text-text-primary">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">
              {(localize as any)('com_custom_privacy_title')}
            </h1>
            <p className="text-base text-text-secondary">
              {(localize as any)('com_custom_privacy_last_updated')}
            </p>
          </div>

          {/* Introduction */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_intro_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_intro_paragraph_1')}
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_intro_paragraph_2')}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_collect_title')}
            </h2>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_privacy_collect_account_title')}
            </h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_collect_account_desc')}
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_privacy_collect_account_email')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_account_name')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_account_password')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_account_preferences')}</li>
            </ul>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_privacy_collect_usage_title')}
            </h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_collect_usage_desc')}
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_privacy_collect_usage_conversations')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_usage_prompts')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_usage_files')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_usage_tokens')}</li>
            </ul>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_privacy_collect_technical_title')}
            </h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_collect_technical_desc')}
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_privacy_collect_technical_ip')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_technical_device')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_technical_browser')}</li>
              <li>{(localize as any)('com_custom_privacy_collect_technical_cookies')}</li>
            </ul>
          </section>

          {/* How We Use Your Data */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_use_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_use_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>
                <strong>{(localize as any)('com_custom_privacy_use_service_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_use_service_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_use_improve_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_use_improve_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_use_communicate_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_use_communicate_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_use_security_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_use_security_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_use_legal_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_use_legal_desc')}
              </li>
            </ul>
          </section>

          {/* Data Storage & Security */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_storage_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_storage_desc')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_privacy_storage_encryption')}</li>
              <li>{(localize as any)('com_custom_privacy_storage_secure_servers')}</li>
              <li>{(localize as any)('com_custom_privacy_storage_access_controls')}</li>
              <li>{(localize as any)('com_custom_privacy_storage_monitoring')}</li>
            </ul>
            <div className="mt-6 rounded-lg border-l-4 border-l-blue-500 bg-surface-tertiary px-5 py-4">
              <p className="text-sm text-text-secondary">
                <strong className="font-semibold">
                  {(localize as any)('com_custom_privacy_storage_note_label')}
                </strong>{' '}
                {(localize as any)('com_custom_privacy_storage_note_content')}
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_third_party_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_third_party_intro')}
            </p>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_privacy_third_party_ai_title')}
            </h3>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_third_party_ai_desc')}
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_privacy_third_party_ai_openai')}</li>
              <li>{(localize as any)('com_custom_privacy_third_party_ai_anthropic')}</li>
              <li>{(localize as any)('com_custom_privacy_third_party_ai_google')}</li>
              <li>{(localize as any)('com_custom_privacy_third_party_ai_others')}</li>
            </ul>

            <h3 className="mb-4 text-lg font-semibold">
              {(localize as any)('com_custom_privacy_third_party_payment_title')}
            </h3>
            <p className="mb-4 text-base text-text-secondary">
              {(localize as any)('com_custom_privacy_third_party_payment_desc')}
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_rights_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_rights_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>
                <strong>{(localize as any)('com_custom_privacy_rights_access_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_rights_access_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_rights_correct_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_rights_correct_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_rights_delete_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_rights_delete_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_rights_export_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_rights_export_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_rights_opt_out_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_rights_opt_out_desc')}
              </li>
            </ul>
          </section>

          {/* Cookies & Tracking */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_cookies_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_cookies_desc')}
            </p>
            <ul className="ml-6 list-disc space-y-3 text-base text-text-secondary">
              <li>
                <strong>{(localize as any)('com_custom_privacy_cookies_essential_title')}</strong> –{' '}
                {(localize as any)('com_custom_privacy_cookies_essential_desc')}
              </li>
              <li>
                <strong>{(localize as any)('com_custom_privacy_cookies_functional_title')}</strong>{' '}
                – {(localize as any)('com_custom_privacy_cookies_functional_desc')}
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_retention_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_retention_desc')}
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-text-secondary">
              <li>{(localize as any)('com_custom_privacy_retention_account')}</li>
              <li>{(localize as any)('com_custom_privacy_retention_conversations')}</li>
              <li>{(localize as any)('com_custom_privacy_retention_logs')}</li>
            </ul>
          </section>

          {/* International Users */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_international_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_international_desc')}
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_international_gdpr')}
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_children_title')}
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_children_desc')}
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_changes_title')}
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_changes_desc')}
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-surface-secondary/50 mb-12 rounded-xl border border-border-medium p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              {(localize as any)('com_custom_privacy_contact_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              {(localize as any)('com_custom_privacy_contact_desc')}
            </p>
            <div className="rounded-lg bg-surface-tertiary p-6">
              <p className="mb-2 text-base">
                <strong>{(localize as any)('com_custom_privacy_contact_email_label')}</strong>{' '}
                <a href="mailto:support@gptchina.io" className="text-blue-500 hover:underline">
                  support@gptchina.io
                </a>
              </p>
              <p className="text-base">
                <strong>{(localize as any)('com_custom_privacy_contact_website_label')}</strong>{' '}
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
