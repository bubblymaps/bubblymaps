import { Check } from "lucide-react"
import { Verified } from "@/components/badges/verified"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { BackButton } from "@/components/back"

export default function VerifiedDocs() {
    return (
        <div className="min-h-screen bg-background">
            <BackButton />
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Header */}
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <Check className="h-5 w-5" strokeWidth={2.5} />
                        </span>
                        <h1 className="text-4xl font-bold text-center">Verified Badge</h1>
                    </div>
                    <p className="text-muted-foreground text-center max-w-2xl">
                        Learn about the verified badge and how to get one.
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="mb-10 p-4 border rounded-lg bg-muted/30">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">On this page</h2>
                    <ul className="space-y-1.5 text-sm">
                        <li><a href="#overview" className="text-blue-600 dark:text-blue-400 hover:underline">Overview</a></li>
                        <li><a href="#types" className="text-blue-600 dark:text-blue-400 hover:underline">Badge Types</a></li>
                        <li><a href="#benefits" className="text-blue-600 dark:text-blue-400 hover:underline">Benefits</a></li>
                        <li><a href="#eligibility" className="text-blue-600 dark:text-blue-400 hover:underline">Eligibility</a></li>
                        <li><a href="#apply" className="text-blue-600 dark:text-blue-400 hover:underline">How to Apply</a></li>
                        <li><a href="#maintaining" className="text-blue-600 dark:text-blue-400 hover:underline">Maintaining Status</a></li>
                        <li><a href="#faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQ</a></li>
                    </ul>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {/* Overview */}
                    <section id="overview" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The verified badge <span className="inline-flex align-middle mx-1"><Verified content="This is what the verified badge looks like!" /></span> is 
                            a blue checkmark displayed next to a user's name. It indicates that Bubbly Maps has confirmed the account 
                            belongs to a notable contributor, organization, or trusted community member.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The badge helps users identify authentic accounts and trustworthy contributions across the platform.
                        </p>
                    </section>

                    {/* Badge Types */}
                    <section id="types" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Badge Types</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We verify accounts in two categories:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 pr-4 font-semibold">Type</th>
                                        <th className="text-left py-3 font-semibold">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b">
                                        <td className="py-3 pr-4 font-medium text-foreground">Contributors</td>
                                        <td className="py-3">Users with consistent, high-quality bubbler submissions</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-3 pr-4 font-medium text-foreground">Organizations</td>
                                        <td className="py-3">Official accounts for water utilities, municipalities, or advocacy groups</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Benefits */}
                    <section id="benefits" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Verified users receive the following benefits:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Verify bubblers:</strong> Gain access to tools for verifying bubbler submissions by other users.</li>
                            <li><strong>Eligibility for Moderator:</strong> Priority consideration when applying to become a platform moderator.</li>
                            <li><strong>Profile Badge:</strong> A nice looking badge displayed on your profile.</li>
                            <li><strong>Access to the Bubbly Index:</strong> Gain exclusive access to use Bubbly APIs in your own applications.</li>
                            <li><strong>Priority Support:</strong> Access to dedicated support channels for faster assistance.</li>
                        </ul>
                    </section>

                    {/* Eligibility */}
                    <section id="eligibility" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
                        
                        <h3 className="text-lg font-medium mb-3 mt-6">Individual Contributors</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                            <li>Account at least 60 days old with regular activity.</li>
                            <li>Minimum 50 approved bubbler submissions.</li>
                            <li>No relevant history of violations, spam, or vandalism on the platform.</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3">Organizations</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                            <li>Official representative of a recognized organization or entity.</li>
                            <li>Documentation proving affiliation.</li>
                            <li>Relevance to water access, public health, or community services.</li>
                        </ul>
                    </section>

                    {/* How to Apply */}
                    <section id="apply" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Verification is available by application only. To apply:
                        </p>
                        <ol className="list-decimal pl-6 text-muted-foreground space-y-3 mb-6">
                            <li>Review the eligibility requirements above</li>
                            <li>Gather supporting documents (for organizations and experts)</li>
                            <li>
                                Email <a href="mailto:get.verified@bubblymaps.org" className="text-blue-600 dark:text-blue-400 hover:underline">get.verified@bubblymaps.org</a> with:
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Your Bubbly Maps username</li>
                                    <li>Requested Category (Contributor or Organization)</li>
                                    <li>Brief explanation of why you should be verified</li>
                                    <li>Supporting documentation or links if applicable</li>
                                </ul>
                            </li>
                            <li>Wait 7-14 business days for review. Our team will gather relevant information from your account to support our decision.</li>
                            <li>Receive decision via email or notification inside the Bubbly Maps app.</li>
                        </ol>

                        <div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>Note:</strong> Meeting eligibility requirements does not guarantee verification. 
                                Each application is reviewed individually based on merit.
                            </p>
                        </div>
                    </section>

                    {/* Maintaining Status */}
                    <section id="maintaining" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Maintaining Status</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To keep your verified badge:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                            <li>Contribute regularly to the community</li>
                            <li>Maintain high accuracy in submissions</li>
                            <li>Follow the <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link> and community guidelines</li>
                            <li>Treat other members respectfully</li>
                            <li>Report inaccuracies and abuse</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3">Revocation</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            Verification may be revoked for:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Terms of Service violations</li>
                            <li>False or spam content</li>
                            <li>Harassment or abuse</li>
                            <li>Inactivity for over 30 days</li>
                            <li>Misrepresenting verified status</li>
                            <li>Any other applicable reasons from Platform Moderators</li>
                        </ul>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="mb-10 scroll-mt-8">
                        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                        
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="cost">
                                <AccordionTrigger className="text-left">Is verification free?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Yes. Verification is free and based on merit. We never charge for verification.
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="time">
                                <AccordionTrigger className="text-left">How long does verification take?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    7-14 business days. Complex organization applications may take longer.
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="reapply">
                                <AccordionTrigger className="text-left">Can I reapply if denied?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Yes, after 90 days. Address any feedback and improve your contribution history first.
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="moderator">
                                <AccordionTrigger className="text-left">What's the difference from a Moderator badge?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Verified badges indicate trusted contributors. <Link href="/moderators" className="text-blue-600 dark:text-blue-400 hover:underline">Moderator badges</Link> indicate users with content review and enforcement responsibilities.
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="others">
                                <AccordionTrigger className="text-left">Can I request verification for someone else?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    No. Requests must come from the account holder or an authorized organization representative.
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="display">
                                <AccordionTrigger className="text-left">Where does the badge appear?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    The checkmark appears next to your name on your profile, contributions, and anywhere your username is shown.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>
                </div>
            </div>
        </div>
    )
}