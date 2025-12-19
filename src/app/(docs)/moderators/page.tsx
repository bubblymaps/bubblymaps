import { Shield } from "lucide-react"
import { Moderator } from "@/components/badges/moderator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { BackButton } from "@/components/back"

export default function ModDocs() {
    return (
        <div className="min-h-screen bg-background">
            <BackButton />
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Header */}
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold text-center">Moderators</h1>
                    </div>
                    <p className="text-muted-foreground text-center max-w-2xl">
                        Learn about our moderation team and how to become a moderator.
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="mb-10 p-4 border rounded-lg bg-muted/30">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">On this page</h2>
                    <ul className="space-y-1.5 text-sm">
                        <li><a href="#overview" className="text-blue-600 dark:text-blue-400 hover:underline">Overview</a></li>
                        <li><a href="#responsibilities" className="text-blue-600 dark:text-blue-400 hover:underline">Responsibilities</a></li>
                        <li><a href="#permissions" className="text-blue-600 dark:text-blue-400 hover:underline">Permissions</a></li>
                        <li><a href="#eligibility" className="text-blue-600 dark:text-blue-400 hover:underline">Eligibility</a></li>
                        <li><a href="#apply" className="text-blue-600 dark:text-blue-400 hover:underline">How to Apply</a></li>
                        <li><a href="#guidelines" className="text-blue-600 dark:text-blue-400 hover:underline">Moderator Guidelines</a></li>
                        <li><a href="#faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQ</a></li>
                    </ul>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {/* Overview */}
                    <section id="overview" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Moderators are trusted community members who help maintain the quality and safety of Bubbly Maps.
                            They review submissions, handle reports, and ensure the platform remains a helpful resource for everyone.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            You can identify moderators by the red shield badge <span className="inline-flex align-middle mx-1"><Moderator /></span> displayed
                            next to their name throughout the platform.
                        </p>
                    </section>

                    {/* Responsibilities */}
                    <section id="responsibilities" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Responsibilities</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Moderators help keep Bubbly Maps accurate and safe. Their duties include:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Review submissions:</strong> Approve, edit, or reject new bubbler submissions.</li>
                            <li><strong>Verify accuracy:</strong> Check that location data and descriptions are correct.</li>
                            <li><strong>Handle reports:</strong> Investigate reported content and take appropriate action.</li>
                            <li><strong>Remove spam:</strong> Delete fake, duplicate, or inappropriate submissions.</li>
                            <li><strong>Enforce guidelines:</strong> Ensure users follow the <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>.</li>
                            <li><strong>Support users:</strong> Answer questions and help new contributors.</li>
                            <li><strong>Escalate issues:</strong> Report serious violations to admins.</li>
                        </ul>
                    </section>

                    {/* Eligibility */}
                    <section id="eligibility" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To be considered for a moderator position, you must meet these requirements:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Account age:</strong> At least 90 days old.</li>
                            <li><strong>Contributions:</strong> Minimum 100 platform contributions.</li>
                            <li><strong>Clean record:</strong> No history of warnings or violations.</li>
                            <li><strong>Activity:</strong> Regular activity over the past 3 months.</li>
                            <li><strong>Availability:</strong> Able to dedicate at least 2-3 hours per month.</li>
                        </ul>
                        <br />
                        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Note:</strong> <Link href="/verified" className="text-blue-600 dark:text-blue-400 hover:underline">Verified users</Link> are
                                given high priority in applications, but is not required.
                            </p>
                        </div>
                    </section>

                    {/* How to Apply */}
                    <section id="apply" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Moderator positions open periodically based on community & platform needs. To apply:
                        </p>
                        <ol className="list-decimal pl-6 text-muted-foreground space-y-3 mb-6">
                            <li>Check that you meet the eligibility requirements above.</li>
                            <li>
                                Email <a href="mailto:become.a.mod@bubblymaps.org" className="text-blue-600 dark:text-blue-400 hover:underline">become.a.mod@bubblymaps.org</a> with:
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Your Bubbly Maps username.</li>
                                    <li>Why you want to become a moderator.</li>
                                    <li>Your availability (hours per month, timezone).</li>
                                    <li>Any relevant experience (other platforms, community work).</li>
                                    <li>Any relevant documents or information.</li>
                                </ul>
                            </li>
                            <li>Wait for a response (we review applications monthly).</li>
                            <li>If selected, complete a brief orientation before receiving moderator access.</li>
                        </ol>

                    </section>

                    <section id="guidelines" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Moderator Guidelines</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            All moderators must follow these guidelines:
                        </p>

                        <h3 className="text-lg font-medium mb-3 mt-6">Do</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                            <li>Be fair and consistent in all decisions</li>
                            <li>Communicate respectfully with all users</li>
                            <li>Document actions taken for transparency</li>
                            <li>Escalate uncertain situations to the core team</li>
                            <li>Stay active and responsive to reports</li>
                            <li>Keep moderator discussions confidential</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3">Don't</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                            <li>Use moderator powers for personal disputes</li>
                            <li>Share private user information</li>
                            <li>Make decisions based on personal bias</li>
                            <li>Publicly discuss ongoing moderation cases</li>
                            <li>Ignore or dismiss user reports</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3">Removal</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Moderator status may be revoked for inactivity, abuse of powers, guideline violations,
                            or at the discretion of the core team. Former moderators may reapply after 6 months.
                        </p>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="paid">
                                <AccordionTrigger className="text-left">Are moderators paid?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    No. Moderation is a volunteer role. We deeply appreciate our moderators' contributions to the community.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="time">
                                <AccordionTrigger className="text-left">How much time does moderation require?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    We ask for a minimum of 2-3 hours per month, but this can be flexible based on your schedule and the current moderation queue.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="verified">
                                <AccordionTrigger className="text-left">Do I need to be verified first?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    No, but verified users are given preference. Focus on meeting the contribution and activity requirements.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="difference">
                                <AccordionTrigger className="text-left">What's the difference from the Verified badge?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    <Link href="/verified" className="text-blue-600 dark:text-blue-400 hover:underline">Verified badges</Link> indicate trusted contributors.
                                    Moderator badges indicate users with content review and enforcement responsibilities.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="inactive">
                                <AccordionTrigger className="text-left">What if I become inactive?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Let us know if you need a break. Extended inactivity (30+ days) without notice may result in removal,
                                    but you can reapply later.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="appeal">
                                <AccordionTrigger className="text-left">How do users appeal moderator decisions?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Users can email <a href="mailto:appeals@bubblymaps.org" className="text-blue-600 dark:text-blue-400 hover:underline">appeals@bubblymaps.org</a>. Appeals are reviewed by the administrative team and we will notify you via. email of the outcome.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>
                </div>
            </div>
        </div>
    )
}